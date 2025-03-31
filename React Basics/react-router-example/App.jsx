import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate, useNavigate, Outlet } from 'react-router-dom';
import './App.css';

// Simulated authentication service
const AuthService = {
  isAuthenticated: false,
  signIn(callback) {
    AuthService.isAuthenticated = true;
    setTimeout(callback, 300);
  },
  signOut(callback) {
    AuthService.isAuthenticated = false;
    setTimeout(callback, 300);
  }
};

// Context for sharing auth state
const AuthContext = React.createContext(null);

function useAuth() {
  return React.useContext(AuthContext);
}

// Home page component
function Home() {
  return (
    <div className="page home-page">
      <h2>Home Page</h2>
      <p>Welcome to the React Router example! Click on the links above to navigate through the application.</p>
      <p>This example demonstrates core concepts of React Router including:</p>
      <ul>
        <li>Basic routing</li>
        <li>Nested routes</li>
        <li>URL parameters</li>
        <li>Protected routes</li>
        <li>Authentication flow</li>
        <li>Navigation programmatically</li>
      </ul>
    </div>
  );
}

// About page component
function About() {
  return (
    <div className="page about-page">
      <h2>About Page</h2>
      <p>This is a simple demonstration of React Router, showing how to set up navigation in a React application.</p>
      <p>React Router is a standard library for routing in React. It enables the navigation among views of various components in a React Application, allows changing the browser URL, and keeps the UI in sync with the URL.</p>
    </div>
  );
}

// Products page with nested routes
function Products() {
  return (
    <div className="page products-page">
      <h2>Products</h2>
      <p>Browse our selection of products:</p>
      
      <nav className="sub-nav">
        <ul>
          <li><Link to="/products/electronics">Electronics</Link></li>
          <li><Link to="/products/books">Books</Link></li>
          <li><Link to="/products/clothing">Clothing</Link></li>
        </ul>
      </nav>
      
      {/* Outlet is where nested route components will render */}
      <div className="product-content">
        <Outlet />
      </div>
    </div>
  );
}

// Product category component
function ProductCategory() {
  const { category } = useParams();
  
  const categoriesData = {
    electronics: {
      title: "Electronics",
      description: "Browse our latest electronics products",
      items: ["Smartphones", "Laptops", "Tablets", "Cameras"]
    },
    books: {
      title: "Books",
      description: "Check out our bestselling books",
      items: ["Fiction", "Science", "Biography", "Self-Help"]
    },
    clothing: {
      title: "Clothing",
      description: "Find the perfect outfit",
      items: ["Men's", "Women's", "Children's", "Accessories"]
    }
  };
  
  const data = categoriesData[category] || {
    title: "Category Not Found",
    description: "This category doesn't exist",
    items: []
  };
  
  return (
    <div className="product-category">
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      
      {data.items.length > 0 && (
        <>
          <h4>Available Items:</h4>
          <ul>
            {data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <p>
            <Link to={`/products/${category}/details`} className="details-link">
              View More Details
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

// Product details component
function ProductDetails() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="product-details">
      <h3>{category} Details</h3>
      <p>Here you would find more information about our {category} products.</p>
      <p>This is a nested route example showing additional details for the selected product category.</p>
      
      <button onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}

// Default product view
function ProductIndex() {
  return (
    <div className="product-index">
      <p>Please select a product category from the menu above.</p>
    </div>
  );
}

// Contact page component
function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    
    // Redirect to thank-you page with state
    navigate('/thank-you', { state: { name: formData.name } });
  };
  
  return (
    <div className="page contact-page">
      <h2>Contact Us</h2>
      <p>Fill out the form below to get in touch with us.</p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

// Thank you page after form submission
function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || 'Friend';
  
  React.useEffect(() => {
    // If accessed directly without state, redirect to contact page
    if (!location.state) {
      navigate('/contact');
    }
  }, [location.state, navigate]);
  
  if (!location.state) return null;
  
  return (
    <div className="page thank-you-page">
      <h2>Thank You!</h2>
      <p>Thank you for your message, {name}! We've received your inquiry and will get back to you soon.</p>
      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
}

// Profile page (protected route)
function Profile() {
  const auth = useAuth();
  
  return (
    <div className="page profile-page">
      <h2>Your Profile</h2>
      <p>Welcome to your profile page!</p>
      <p>This is a protected route that is only accessible to authenticated users.</p>
      <p>You are logged in as: <strong>User123</strong></p>
      
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

// Login page
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = () => {
    auth.signIn(() => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page
      navigate(from, { replace: true });
    });
  };
  
  return (
    <div className="page login-page">
      <h2>Login</h2>
      <p>You need to be logged in to view the protected page.</p>
      <p>You were redirected from: <code>{from}</code></p>
      
      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

// Not Found page
function NotFound() {
  return (
    <div className="page not-found-page">
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
}

// Protected route wrapper component
function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  
  if (!auth.isAuthenticated) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Auth provider component
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(AuthService.isAuthenticated);
  const navigate = useNavigate();
  
  const signIn = (callback) => {
    AuthService.signIn(() => {
      setIsAuthenticated(true);
      callback();
    });
  };
  
  const signOut = () => {
    AuthService.signOut(() => {
      setIsAuthenticated(false);
      navigate('/');
    });
  };
  
  const value = { isAuthenticated, signIn, signOut };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Navigation component
function Navigation() {
  const auth = useAuth();
  
  return (
    <nav className="main-nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          {auth.isAuthenticated ? (
            <Link to="/profile">Profile</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

// Missing useLocation import for ThankYou component
function useLocation() {
  return React.useContext(NavigationContext).location;
}

// Placeholder for NavigationContext
const NavigationContext = React.createContext(null);

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <header>
            <h1>React Router Example</h1>
            <Navigation />
          </header>
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />}>
                <Route index element={<ProductIndex />} />
                <Route path=":category" element={<ProductCategory />} />
                <Route path=":category/details" element={<ProductDetails />} />
              </Route>
              <Route path="/contact" element={<Contact />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/profile" 
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <footer>
            <p>React Router Example - Created for FullStack Forge</p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
