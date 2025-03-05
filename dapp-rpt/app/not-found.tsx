import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="space-y-4 text-center">
        <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">
          Désolé, nous n&apos;avons pas pu trouver la ressource demandée
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-sm hover:bg-blue-600 transition-colors duration-200"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  )
}