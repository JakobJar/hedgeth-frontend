import {PrismaClient} from "@prisma/client";
import {InfluxDB} from "@influxdata/influxdb-client";

const prismaClient = new PrismaClient();

const influxClient = new InfluxDB({
    url: process.env.INFLUXDB_URL!,
    token: process.env.INFLUXDB_TOKEN!,
});
const influxQuery = influxClient.getQueryApi(process.env.INFLUXDB_ORG!);

// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

export default defineEventHandler((event) => {
    event.context.prisma = prismaClient;
    event.context.influx = influxQuery;
});