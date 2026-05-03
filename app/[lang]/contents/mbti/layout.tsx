export default function MBTILayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative bg-muted min-h-screen">
            {children}
        </div>
    );
}
