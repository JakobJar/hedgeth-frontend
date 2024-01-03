import {Fund, PrismaClient} from "@prisma/client";
import {QueryApi} from "@influxdata/influxdb-client";

interface Response extends Fund {
    value?: number;
}

export default defineEventHandler(async (event) => {
    const prismaClient: PrismaClient = event.context.prisma;
    const influxQuery: QueryApi = event.context.influx;

    const address = getRouterParam(event, "address");
    if (!address)
        throw createError({
            status: 400,
            statusMessage: "No address provided"
        });

    const fund: Response | null = await prismaClient.fund.findUnique({
        where: {
            address: address,
        }
    });

    if (!fund)
        throw createError({
            status: 404,
            statusMessage: "Fund not found"
        });

    const fundValueQuery = `from(bucket: "fund-data")
              |> range(start: 0)
              |> filter(fn: (r) => r["_measurement"] == "fund_value")
              |> filter(fn: (r) => r["_field"] == "value")
              |> filter(fn: (r) => r["fund_address"] == "${address}")
              |> last()
              |> map(fn: (r) => ({value: r["_value"]}))
              |> yield(name: "last")`;
    const fundValue: any = await influxQuery.collectRows(fundValueQuery);
    fund.value = fundValue[0].value;
    return fund;
});