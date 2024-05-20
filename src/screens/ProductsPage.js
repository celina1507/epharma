import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  makeStyles,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../context/AuthContext';
const useStyles = makeStyles({
  card: {
    width: 300,
    margin: '10px',
  },
  media: {
    height: 200,
    resizeMode: 'contain',
    margin:2,

  },
  textStyle: {
    fontFamily: 'Merriweather',
    fontSize: '15px',
    color: 'black',

  },
  textStyle2: {
    fontFamily: 'Merriweather',
    fontSize: '17px',
    color: '#3498db',

  },
});

const ProductsPage = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  const constructImageUrl = (imageName) => {
    // Assuming your server is serving static files from the 'public' folder
    const type = "PNG";
    return require(`../images/${imageName}.${type}`);
  };
  
  const handleAddToCart = async (product) => {
    try {
      setLoading(true);

      const { ProductTitle, Price, Quantity } = product;
      const ShopCartID = user.shopCartID;
      // console.log('ShopCartID in add to cart:', ShopCartID);
      // console.log('ShopCartID:', ShopCartID);

      const response = await fetch('http://localhost:3001/api/cartItems/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ShopCartID,
          Price,
          ProductName: ProductTitle,
          Quantity,
        }),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        console.log('Product added to cart:', addedProduct);

        showSuccessSnackbar('Product added to cart');
      } else {
        console.error('Error adding product to cart:', response.status, response.statusText);
        showErrorSnackbar('Failed to add product to cart');
      }
    } catch (error) {
      console.error('API Error:', error);
      showErrorSnackbar('Failed to add product to cart');
    } finally {
      setLoading(false);
    }
  };
  const showSuccessSnackbar = (successMessage) => {
    setSnackbarSeverity('success');
    setSnackbarMessage(successMessage);
    setSnackbarOpen(true);
  };

  const showErrorSnackbar = (errorMessage) => {
    setSnackbarSeverity('error');
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
      }}
    >
      <h1
      style={{
        fontFamily: 'Merriweather',
        fontSize: '30px',
        color: '#3498db',
        margin: '20px',
      
      }}
      >Products Catalog</h1>
      <div
     style={{
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '20px',
    }} 
      >
      {products.map((product) => (
        <Card key={product.ProductID} className={classes.card}>
          <CardMedia
            className={classes.media}
            image={constructImageUrl(product.ProductImage)}
            title={product.ProductTitle}
          />
          <CardContent
        
          >
            <Typography variant="h6"
            className={classes.textStyle2}
            >{product.ProductTitle}</Typography>
            <Typography variant="body2"   className={classes.textStyle}>
              Price: ${product.Price}
            </Typography>
            <Typography variant="body2"  className={classes.textStyle}>
              Quantity: {product.Quantity}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
             style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              fontFamily: 'Merriweather',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
            onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          </CardActions>
        </Card>
      ))}
      </div>
     {/* Snackbar */}
     <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Backdrop for loading indicator */}
      <Backdrop className={classes.backdrop} open={loading}
      style={{
        zIndex: 2,
        color: '#fff',
      
      }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ProductsPage;
