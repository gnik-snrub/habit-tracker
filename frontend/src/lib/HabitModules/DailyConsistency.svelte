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
        type: 'doughnut',
        data: {
          labels: ['Checked In', 'Missed'],
          datasets: [{
            data: [calculateConsistency(habit.instances), 100 - calculateConsistency(habit.instances)],
          }]
        },
        options: {
          responsive: true,
          borderColor: 'rgb(252, 239, 249)',
          backgroundColor: ['rgb(39, 154, 241)', 'rgb(69, 72, 81)'],
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgb(252, 239, 249)'
              }
            }
          }
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
    height: 25% !important;
    width: 25% !important;
  }
</style>
