<script lang="ts">
export let habit: Habit
import { afterUpdate } from 'svelte';
import { Chart } from 'chart.js/auto'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'

Chart.register(MatrixController, MatrixElement)

let heatmapChart: Chart
let canvasElement: HTMLCanvasElement

function buildChart() {
  canvasElement = document.getElementById("heatmapCalendar") as HTMLCanvasElement
  if (heatmapChart) {
    heatmapChart.destroy()
  }
  const instanceData = habit.instances.reduce((acc, curr) => {
    const currDate = curr.toString().slice(0, 10)
    const index = acc.findIndex(obj => obj.date === currDate)
    if (index === -1) {
      acc.push({ date: currDate, count: 1 })
    } else {
      acc[index].count += 1
    }
    return acc
  }, [])
    /*{
      type: 'matrix',
      data: {
        labels: instanceData.map(obj => obj.date),
        datasets: [
          {
            label: 'Instances',
            data: instanceData.map(obj => obj.count),
          }
        ]
      }
    }
    */
    const h = 5
    const w = 4
    const config= {
      type: 'matrix',
      data: {
        datasets: [{
          label: 'Basic Matrix',
          data: [{x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 4}],
          borderWidth: 5,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          backgroundColor: 'rgba(200, 200, 0, 0.3)',
          width: ({chart}) => (chart.chartArea || {}).width / w - 1,
          height: ({chart}) => (chart.chartArea || {}).height / h - 1,
        }],
      },
      options: {
        scales: {
          x: {
            display: true,
            min: 0.5,
            max: w + 0.5,
            offset: false
          },
          y: {
            display: true,
            min: 0,
            max: h,
            offset: false
          }
        }
      }
    }
  heatmapChart = new Chart(canvasElement, config)
}

afterUpdate(buildChart)
</script>

<div>
  <h3>Calendar</h3>
  <canvas id="heatmapCalendar" height="20" width="100"></canvas>
</div>

<style>
  h3 {
    rotate: -90deg;
  }
  div {
    width: 100%;
    height: 30vh;
    margin: 1.5em 0;
    padding: 1em 0;
    outline: 1px solid var(--accent-color);
    background-color: var(--dark-bg-shadow-color);
    display: flex;
    align-items: center;
  }
  canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
    justify-self: center;
  }
</style>
