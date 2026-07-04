import { Link } from "react-router-dom"; 

export default function AdminLayout({ children }) {   
  return (     
    <div className="min-h-screen flex bg-[#f8f8f8]">       
      {/* Sidebar */}       
      <aside className="w-72 bg-white shadow-lg">         
        <div className="p-6 border-b">           
          <div className="flex items-center gap-3">   
            <img     
              src="/logo.png"     
              alt="logo"     
              className="w-10 h-10"   
            />   
            <div>     
              <h1 className="font-bold">       
                Chandrakala     
              </h1>     
              <p className="text-xs text-yellow-600">       
                Admin Panel     
              </p>   
            </div> 
          </div>         
        </div>         
        <nav className="p-4 space-y-2">           
          <Link             
            to="/admin/dashboard"             
            className="block p-3 rounded-xl hover:bg-yellow-50"           
          >             
            Dashboard           
          </Link>           
          <Link             
            to="/admin/products"             
            className="block p-3 rounded-xl hover:bg-yellow-50"           
          >             
            Products           
          </Link>           
          <Link             
            to="/admin/rates"             
            className="block p-3 rounded-xl hover:bg-yellow-50"           
          >             
            Rates           
          </Link>           
          <Link             
            to="/admin/categories"             
            className="block p-3 rounded-xl hover:bg-yellow-50"           
          >             
            Categories           
          </Link>         
        </nav>       
      </aside>       
      
      {/* Content */}       
      <main className="flex-1 p-8">         
        {children}       
      </main>     
    </div>   
  ); 
}