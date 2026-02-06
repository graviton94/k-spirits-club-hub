export default function MBTILayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative bg-neutral-900 min-h-screen">
            {children}
        </div>
    );
}
