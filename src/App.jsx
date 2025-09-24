import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Receiving from "./pages/Receiving.jsx";

// stub pages (you can replace with real ones later)
function Vendors() {
  return <h2 className="text-xl font-semibold text-blue-600">Vendors Page</h2>;
}
function Orders() {
  return <h2 className="text-xl font-semibold text-blue-600">Orders Page</h2>;
}
function Errors() {
  return <h2 className="text-xl font-semibold text-blue-600">Errors Page</h2>;
}
function Barcodes() {
  return <h2 className="text-xl font-semibold text-blue-600">Barcodes Page</h2>;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/receiving" element={<Receiving />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/errors" element={<Errors />} />
          <Route path="/barcodes" element={<Barcodes />} />
        </Routes>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Receiving Guide</span>
          <span className="text-blue-600">Built with React + Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
