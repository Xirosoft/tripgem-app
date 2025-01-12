import { useUserStore } from '@/stores/user'

const buildNavigation = () => {
  const userStore = useUserStore()
  const isAdmin = userStore?.user?.role === 'admin'

  const dashboardItems = [
    { title: 'Analytics', to: '/analytics' },
    { title: 'CRM', to: '/crm' },
    { title: 'eCommerce', to: '/ecommerce' },
    { title: 'Logistics', to: '/logistics' },
    { title: 'Academy', to: '/academy' },
  ]

  const adminOnlyItems = [
    {
      title: 'User Management',
      icon: 'ti ti-users',
      children: [
        { title: 'Users List', to: '/users' },
        { title: 'Roles', to: '/roles' },
        { title: 'Permissions', to: '/permissions' },
      ],
    },
    {
      title: 'System Settings',
      icon: 'ti ti-settings',
      children: [
        { title: 'General', to: '/settings/general' },
        { title: 'Security', to: '/settings/security' },
        { title: 'Configurations', to: '/settings/configs' },
      ],
    },
  ]

  const commonNavigation = [
    {
      title: 'Dashboards',
      icon: 'ti ti-smart-home',
      badge: { content: dashboardItems.length.toString(), class: 'bg-danger' },
      children: dashboardItems,
    },
    {
      title: 'Apps',
      icon: 'ti ti-apps',
      children: [
        { title: 'Email', to: '/apps/email', icon: 'ti ti-mail' },
        { title: 'Chat', to: '/apps/chat', icon: 'ti ti-messages' },
        { title: 'Calendar', to: '/apps/calendar', icon: 'ti ti-calendar' },
      ],
    },
    {
      title: 'Pages',
      icon: 'ti ti-file',
      children: [
        { title: 'Profile', to: '/pages/profile' },
        { title: 'Account Settings', to: '/pages/account-settings' },
        { title: 'FAQ', to: '/pages/faq' },
      ],
    },
  ]

  // Merge admin items if user is admin
  return isAdmin ? [...commonNavigation, ...adminOnlyItems] : commonNavigation
}

export default buildNavigation()
