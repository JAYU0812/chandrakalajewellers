import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../components/common/AdminLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { PublicRoute } from '../components/common/PublicRoute';

// Lazy Loaded customer facing components
const Homepage = lazy(() => import('../features/homepage/Homepage').then(m => ({ default: m.Homepage })));
const ProductListPublic = lazy(() => import('../features/products/ProductListPublic').then(m => ({ default: m.ProductListPublic })));
const ProductDetailPublic = lazy(() => import('../features/products/ProductDetailPublic').then(m => ({ default: m.ProductDetailPublic })));
const WishlistPage = lazy(() => import('../features/products/WishlistPage').then(m => ({ default: m.WishlistPage })));
const ComparePage = lazy(() => import('../features/products/ComparePage').then(m => ({ default: m.ComparePage })));
const BlogListPublic = lazy(() => import('../features/blogs/BlogListPublic').then(m => ({ default: m.BlogListPublic })));
const BlogDetailPublic = lazy(() => import('../features/blogs/BlogDetailPublic').then(m => ({ default: m.BlogDetailPublic })));

// Lazy Loaded Admin authentications
const Login = lazy(() => import('../features/admin/Login').then(m => ({ default: m.Login })));
const DashboardPlaceholder = lazy(() => import('../features/admin/DashboardPlaceholder').then(m => ({ default: m.DashboardPlaceholder })));
const MediaLibrary = lazy(() => import('../features/admin/MediaLibrary').then(m => ({ default: m.MediaLibrary })));
const ProductList = lazy(() => import('../features/admin/ProductList').then(m => ({ default: m.ProductList })));
const ProductForm = lazy(() => import('../features/admin/ProductForm').then(m => ({ default: m.ProductForm })));
const CategoryList = lazy(() => import('../features/admin/CategoryList').then(m => ({ default: m.CategoryList })));
const CategoryForm = lazy(() => import('../features/admin/CategoryForm').then(m => ({ default: m.CategoryForm })));
const CollectionList = lazy(() => import('../features/admin/CollectionList').then(m => ({ default: m.CollectionList })));
const CollectionForm = lazy(() => import('../features/admin/CollectionForm').then(m => ({ default: m.CollectionForm })));
const RateManager = lazy(() => import('../features/admin/RateManager').then(m => ({ default: m.RateManager })));
const HomepageBuilder = lazy(() => import('../features/admin/HomepageBuilder').then(m => ({ default: m.HomepageBuilder })));

// Lazy Loaded Completion Phase Modules
const AnalyticsDashboard = lazy(() => import('../features/admin/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const StoreList = lazy(() => import('../features/admin/StoreList').then(m => ({ default: m.StoreList })));
const StoreForm = lazy(() => import('../features/admin/StoreForm').then(m => ({ default: m.StoreForm })));
const BlogList = lazy(() => import('../features/admin/BlogList').then(m => ({ default: m.BlogList })));
const BlogForm = lazy(() => import('../features/admin/BlogForm').then(m => ({ default: m.BlogForm })));
const TestimonialList = lazy(() => import('../features/admin/TestimonialList').then(m => ({ default: m.TestimonialList })));
const GlobalSettings = lazy(() => import('../features/admin/GlobalSettings').then(m => ({ default: m.GlobalSettings })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Routes>
        {/* Customer Public Pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductListPublic />} />
        <Route path="/products/:id" element={<ProductDetailPublic />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/blogs" element={<BlogListPublic />} />
        <Route path="/blogs/:slug" element={<BlogDetailPublic />} />

        {/* Admin Authentication - Public only, redirects if logged in */}
        <Route 
          path="/admin/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Protected Admin Console Shell (Shared Layout wrapper) */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager', 'store_manager']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard index */}
          <Route path="/admin/dashboard" element={<DashboardPlaceholder />} />
          
          {/* Business Analytics */}
          <Route 
            path="/admin/analytics" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'store_manager']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Boutique Showroom Locations Management */}
          <Route 
            path="/admin/stores" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'store_manager']}>
                <StoreList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/stores/new" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'store_manager']}>
                <StoreForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/stores/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'store_manager']}>
                <StoreForm />
              </ProtectedRoute>
            } 
          />

          {/* Media Manager page with page-level role gating */}
          <Route 
            path="/admin/media" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <MediaLibrary />
              </ProtectedRoute>
            } 
          />

          {/* Product Catalog CRUD routes */}
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <ProductList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products/new" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <ProductForm />
              </ProtectedRoute>
            } 
          />

          {/* Categories taxonomy CRUD routes */}
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <CategoryList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories/new" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <CategoryForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <CategoryForm />
              </ProtectedRoute>
            } 
          />

          {/* Collections editorial CRUD routes */}
          <Route 
            path="/admin/collections" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <CollectionList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/collections/new" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <CollectionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/collections/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <CollectionForm />
              </ProtectedRoute>
            } 
          />

          {/* Blog CMS routes */}
          <Route 
            path="/admin/blogs" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <BlogList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blogs/new" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <BlogForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blogs/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <BlogForm />
              </ProtectedRoute>
            } 
          />

          {/* Testimonials approvals */}
          <Route 
            path="/admin/testimonials" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <TestimonialList />
              </ProtectedRoute>
            } 
          />

          {/* Daily Commodity Rates updates */}
          <Route 
            path="/admin/rates" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'store_manager']}>
                <RateManager />
              </ProtectedRoute>
            } 
          />

          {/* Visual landing pages layouts settings */}
          <Route 
            path="/admin/homepage" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'catalog_manager']}>
                <HomepageBuilder />
              </ProtectedRoute>
            } 
          />

          {/* Global Settings */}
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <GlobalSettings />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Fallback 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-pearl dark:bg-obsidian flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
              <h1 className="font-serif text-7xl text-gold-primary mb-4 font-light animate-pulse">404</h1>
              <h2 className="font-serif text-xl mb-3">Showroom Page Not Found</h2>
              <p className="text-sm text-obsidian/60 dark:text-pearl/50 mb-8 max-w-sm leading-relaxed font-sans font-light">
                The specific collection gallery, article, or resource requested could not be retrieved.
              </p>
              <a 
                href="/" 
                className="text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light hover:underline font-semibold font-sans"
              >
                Return to Showroom
              </a>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
};
