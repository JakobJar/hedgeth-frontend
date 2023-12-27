<template>
  <div class="chart">
    <div class="range">
      <div v-for="(timeframe, index) in ranges" :key="index" @click="selectedTimeframe = index"
           :class="{'range-item': true, 'selected': selectedTimeframe === index}">
        <span>{{ timeframe.label }}</span>
      </div>
    </div>
    <Line v-if="!pending && data" :data="data.chartData" :options="chartOptions"/>
  </div>
</template>

<script setup lang="ts">
import {Line} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const props = defineProps<{
  address: string
}>();

const ranges = [
  {key: '1d', label: '1D'},
  {key: '1w', label: '1W'},
  {key: '1m', label: '1M'},
  {key: '1y', label: '1Y'},
  {key: '0', label: 'ALL'},
];
const selectedTimeframe = ref(1);

const chartOptions = {
  responsive: true,
  borderColor: '#868686',
  scales: {
    x: {
      ticks: {
        display: false
      },
      border: {
        display: false
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        callback: (value: number) => {
          return '$' + value.toLocaleString()
        },
        font: {
          size: 13,
          family: 'Inter',
          weight: '400'
        }
      },
      border: {
        display: false
      },
      grid: {
        display: false
      },
    }
  }
}

const {data, pending, error} = useAsyncData(async () => {
  const data = await $fetch(`/api/fund/${props.address}/chart`, {
    query: {
      range: ranges[selectedTimeframe.value].key,
    }
  });

  return {
    chartData: {
      labels: data.map((item: any) => new Date(item._time).toLocaleString()),
      datasets: [{
        data: data.map((item: any) => item._value * 100),
        borderColor: '#000000',
        backgroundColor: '#000000',
      }]
    }
  };
}, {watch: [selectedTimeframe]});
</script>

<style scoped lang="scss">
.chart {
  display: flex;
  height: 800px;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--medium-spacing);
  align-self: stretch;
}

.range {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;

  .range-item {
    display: flex;
    width: 36px;
    height: 36px;
    border-radius: var(--border-radius);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    color: var(--secondary-color);

    &:hover {
      background: var(--background-hover);
    }

    &.selected {
      background: var(--primary-color);
      color: var(--background-color);
    }

    & > span {
      font-size: 0.9rem;
    }
  }
}
</style>