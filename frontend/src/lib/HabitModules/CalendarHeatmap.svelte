<script lang="ts">
  import CalHeatmap from 'cal-heatmap'
  import 'cal-heatmap/cal-heatmap.css'
  import Tooltip from 'cal-heatmap/plugins/Tooltip'
  import {afterUpdate} from 'svelte';

  export let habit: Habit
  export let updateHabitStore: () => Promise<void>
  updateHabitStore = (): Promise<void> => { return }

  $: instanceData = habit.instances.reduce((acc, curr) => {
    const currDate = curr.toString().slice(0, 10)
    const index = acc.findIndex(obj => obj.date === currDate)
    if (index === -1) {
      acc.push({ date: currDate, count: 1 })
    } else {
      acc[index].count += 1
    }
    return acc
  }, [])

  const cal: CalHeatmap = new CalHeatmap()

  function generateHeatmap() {
    cal.paint({
      itemSelector: '#cal-heatmap',
      domain: {
        type: 'month',
        label: {
          position: 'top',
        },
        gutter: 8,
      },
      subDomain: {
        type: 'day',
        radius: 2,
      },
      date: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 11)),
        highlight: [new Date()],
      },
      data: {
        source: instanceData,
        x: (data: { date: string, count: number }) => data.date,
        y: (data: { date: string, count: number }) => data.count,
        groupY: 'average',
        defaultValue: 0,
      },
      scale: {
        color: {
          range: ['rgb(59, 62, 69)', 'rgb(39, 154, 241)'],
          type: 'linear',
          domain: [0, 7],
        }
      }
    },
      [
        [Tooltip,
          {
            text: (date, value, dayjsDate) => `${value} engagements with ${habit.name} on ${dayjsDate.format('DD/MM/YYYY')}`,
          }
        ],
      ]
    )
  }

  afterUpdate(generateHeatmap)
</script>

<h3>
  Calendar
</h3>
<div id="calendarWrapper">
  <div id="cal-heatmap"></div>
</div>

<style>
  h3 {
    rotate: -90deg;
  }
  #calendarWrapper {
    padding-bottom: 0.5em;
    margin-right: 1em;
    overflow-x: auto;
  }
</style>
