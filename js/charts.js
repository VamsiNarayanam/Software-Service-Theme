if (typeof Chart !== 'undefined') {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartDefaults = {
    plugins: {
      legend: { labels: { color: textColor } }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };

  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [3200, 4100, 3800, 5200, 4900, 6200],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
    });
  }

  const ordersCtx = document.getElementById('ordersChart');
  if (ordersCtx) {
    new Chart(ordersCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Orders',
          data: [12, 19, 8, 15, 22, 18, 14],
          backgroundColor: 'rgba(14, 165, 233, 0.7)',
          borderRadius: 6
        }]
      },
      options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
    });
  }

  const trafficCtx = document.getElementById('trafficChart');
  if (trafficCtx) {
    new Chart(trafficCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          { label: 'Page Views', data: [2400, 3200, 2800, 4100], borderColor: '#6366f1', fill: true, backgroundColor: 'rgba(99, 102, 241, 0.1)', tension: 0.4 },
          { label: 'Visitors', data: [1200, 1800, 1500, 2200], borderColor: '#0ea5e9', fill: true, backgroundColor: 'rgba(14, 165, 233, 0.1)', tension: 0.4 }
        ]
      },
      options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
    });
  }

  const behaviorCtx = document.getElementById('behaviorChart');
  if (behaviorCtx) {
    new Chart(behaviorCtx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          data: [55, 35, 10],
          backgroundColor: ['#6366f1', '#0ea5e9', '#06b6d4'],
          borderWidth: 0
        }]
      },
      options: { ...chartDefaults, responsive: true, maintainAspectRatio: false }
    });
  }
}
