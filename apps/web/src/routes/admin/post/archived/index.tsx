import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/post/archived/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/post/archived/"!</div>
}
