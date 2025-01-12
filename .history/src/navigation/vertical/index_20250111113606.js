export default [
  {
    title: 'Dashboards',
    icon: 'ti ti-smart-home',
    badge: { content: '5', class: 'bg-danger' },
    children: [
      { title: 'Analytics', to: '/analytics' },
      { title: 'CRM', to: '/crm' },
      { title: 'eCommerce', to: '/ecommerce' },
      { title: 'Logistics', to: '/logistics' },
      { title: 'Academy', to: '/academy' },
    ],
  },
  {
    title: 'Layouts',
    icon: 'ti ti-layout-sidebar',
    children: [
      { title: 'Collapsed menu', to: '/layouts/collapsed-menu' },
      { title: 'Content navbar', to: '/layouts/content-navbar' },
      { title: 'Content nav + Sidebar', to: '/layouts/content-nav-sidebar' },
      { title: 'Horizontal', to: '/layouts/horizontal' },
      { title: 'Without menu', to: '/layouts/without-menu' },
      { title: 'Without navbar', to: '/layouts/without-navbar' },
      { title: 'Fluid', to: '/layouts/fluid' },
      { title: 'Container', to: '/layouts/container' },
      { title: 'Blank', to: '/layouts/blank' },
    ],
  },
  {
    title: 'Front Pages',
    icon: 'ti ti-files',
    children: [
      { title: 'Landing', to: '/landing', target: '_blank' },
      { title: 'Pricing', to: '/pricing', target: '_blank' },
      { title: 'Payment', to: '/payment', target: '_blank' },
      { title: 'Checkout', to: '/checkout', target: '_blank' },
      { title: 'Help Center', to: '/help-center', target: '_blank' },
    ],
  },
  {
    title: 'Apps & Pages',
    icon: 'ti ti-package',
    children: [
      { title: 'Email', to: '/apps/email', icon: 'ti ti-mail' },
      { title: 'Chat', to: '/apps/chat', icon: 'ti ti-messages' },
      { title: 'Calendar', to: '/apps/calendar', icon: 'ti ti-calendar' },
      { title: 'Kanban', to: '/apps/kanban', icon: 'ti ti-layout-kanban' },
      {
        title: 'eCommerce',
        icon: 'ti ti-shopping-cart',
        children: [
          { title: 'Dashboard', to: '/apps/ecommerce/dashboard' },
          { title: 'Products', to: '/apps/ecommerce/products' },
          { title: 'Orders', to: '/apps/ecommerce/orders' },
          { title: 'Customers', to: '/apps/ecommerce/customers' },
        ],
      },
    ],
  },
]
