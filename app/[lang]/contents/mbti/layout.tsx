export default function MBTILayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            {children}
        </div>
    );
}
