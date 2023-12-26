import {PrismaClient} from "@prisma/client";
import {InfluxDB} from "@influxdata/influxdb-client";

const prismaClient = new PrismaClient();

const influxClient = new InfluxDB({
    url: process.env.INFLUXDB_URL!,
    token: process.env.INFLUXDB_TOKEN!,
});
const influxQuery = influxClient.getQueryApi(process.env.INFLUXDB_ORG!);

export default defineEventHandler((event) => {
    event.context.prisma = prismaClient;
    event.context.influx = influxQuery;
});