import { redirect } from 'next/navigation';

export default function WifiPage() {
  // WiFi does not have its own page; it is an integrated amenity of the Workspace page
  redirect('/workspace');
}
