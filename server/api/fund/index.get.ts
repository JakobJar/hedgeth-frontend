import {Fund, PrismaClient} from "@prisma/client";
import {QueryApi} from "@influxdata/influxdb-client";

interface Response {
    address: string;
    name: string;
    manager: string;
    raisingClose: Date | null;
    close: Date | null;
    value?: number;
}

export default defineEventHandler(async (event) => {
    const prismaClient: PrismaClient = event.context.prisma;
    const influxQuery: QueryApi = event.context.influx;

    const query = getQuery(event);
    const take = typeof query.take == "number" ? query.take : 10;
    if (take > 25)
        throw createError({
            status: 400,
            statusMessage: "Cannot load more than 25"
        });
    const skip = typeof query.skip == "number" ? query.skip : 0;

    const funds: Response[] = await prismaClient.fund.findMany({skip: skip, take: take,
        select: {address: true, name: true, manager: true, raisingClose: true, close: true}});

    const addresses = funds.map(fund => fund.address);
    let fundMap = Object.fromEntries(funds.map(x => [x.address, x]));

    const fundValueQuery = `from(bucket: "fund-data")
              |> range(start: 0)
              |> filter(fn: (r) => r["_measurement"] == "fund_value")
              |> filter(fn: (r) => r["_field"] == "value")
              |> filter(fn: (r) => contains(value: r["fund_address"], set: ${JSON.stringify(addresses)}))
              |> group(columns: ["fund_address"])
              |> last()
              |> map(fn: (r) => ({address: r["fund_address"], value: r["_value"]}))
              |> yield(name: "last")`;
    const fundValues: any[] = await influxQuery.collectRows(fundValueQuery);
    for (const fundValue of fundValues) {
        fundMap[fundValue.address].value = fundValue.value;
    }
    return Object.values(fundMap) as Response[];
});