<script lang="ts">
  import {onMount} from "svelte";
  import Chart from 'chart.js/auto'

  export let props: {habit: Habit}
  $: habit = props.habit

  function calculateConsistency(instances: string[]): number {
    if (instances.length === 0) {
      return 0
    }
    const difference = new Date().getTime() - new Date(instances[instances.length - 1]).getTime()
    const daysSinceStart = Math.round(difference / (1000 * 3600 * 24))
    const daysEngaged = Object.keys(getDates(instances)).length
    return Math.round(daysEngaged / daysSinceStart * 100)
  }

  function getDates(instances: string[]): string[] {
    return Object.keys(instances.reduce((acc, instance) => {
      acc[new Date(instance).toLocaleDateString()] = true
      return acc
    }, {}))
  }

  function createChart() {
    new Chart('consistencyChart',
      {
        type: 'pie',
        data: {
          labels: ['Engaged', 'Missed'],
          datasets: [{
            data: [calculateConsistency(habit.instances), 100 - calculateConsistency(habit.instances)],
            backgroundColor: ['rgb(39, 154, 241)', 'rgb(59, 62, 69)'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
        }
      })
  }

  onMount(() => {
    calculateConsistency(habit.instances)
    createChart()
  })
</script>

<h3>Days hit</h3>
<div id="stuff">
  {#if habit.instances.length > 0}
    <canvas id="consistencyChart" />
  {:else}
    <p>No engagements</p>
  {/if}
</div>

<style>
  #stuff {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
  }
  #consistencyChart {
    height: 350px !important;
    width: 350px !important;
  }
</style>
