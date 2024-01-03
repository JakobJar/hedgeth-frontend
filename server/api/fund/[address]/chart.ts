import {QueryApi} from "@influxdata/influxdb-client";

const getIntervalInterval = (range: any): string | undefined => {
    if (typeof range !== "string")
        return undefined;
    if (range === "1d")
        return "1h";
    if (range === "1w")
        return "6h";
    if (range === "1m")
        return "1d";
    if (range === "1y")
        return "1w";
    if (range === "0")
        return "1m";
    return undefined;
}

export default defineEventHandler(async (event) => {
    const influxQuery: QueryApi = event.context.influx;

    const address = getRouterParam(event, "address");
    const range = getQuery(event).range ?? "0";

    if (!address)
        throw createError({
            status: 400,
            statusMessage: "No address provided"
        });

    const interval = getIntervalInterval(range);
    if (!interval)
        throw createError({
            status: 400,
            statusMessage: "Invalid range"
        });

    const query = 'from(bucket: "fund-data")\n' +
        `  |> range(start: -${range})\n` +
        '  |> filter(fn: (r) => r["_measurement"] == "fund_value")\n' +
        `  |> filter(fn: (r) => r["fund_address"] == "${address}")\n` +
        `  |> aggregateWindow(every: ${interval}, fn: last, createEmpty: false)\n` +
        '  |> map(fn: (r) => ({time: r["_time"], value: r["_value"]}))\n' +
        '  |> yield(name: "last")';

    return await influxQuery.collectRows(query);
});