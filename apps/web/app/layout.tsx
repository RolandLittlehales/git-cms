import './global.css';

export const metadata = {
  title: 'Git CMS',
  description: 'A Git-based multi-tenant content management system',
};

// Inline script that runs before first paint to prevent dark-mode FOUC.
// Sets data-color-mode on <html> so the ThemeProvider can read it synchronously.
// Runs before first paint: sets both `data-color-mode` and the `dark` class
// on <html> so CSS variables and Tailwind dark: variants work immediately.
const colorModeScript = `
(function(){
  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var mode = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-mode', mode);
  if (isDark) document.documentElement.classList.add('dark');
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
