import './global.css';

export const metadata = {
  title: 'Git CMS',
  description: 'A Git-based multi-tenant content management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
