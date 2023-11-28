import Image from 'next/image'
import { RedirectType, permanentRedirect, redirect } from 'next/navigation'

export default function Home() {
  redirect("/todos", RedirectType.replace)
}
