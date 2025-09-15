import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <>
      <div>
        <title>Unauthorized Access</title>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-6xl font-bold text-gray-800">401</h1>

          <p className="mt-3 text-2xl text-gray-600">Unauthorized Access</p>

          <p className="mt-4 max-w-md text-lg text-gray-500">
            You don&apos;t have permission to access this page.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Return Home
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default UnauthorizedPage;
