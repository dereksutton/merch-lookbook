import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Page from './components/Page';
import Cover from './components/Cover';

function App() {
  // Configuration
  const totalPages = 3; // For test1.png, test2.png, test3.png
  const [pageNumber, setPageNumber] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const book = useRef(null);
  
  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track image loading progress
  useEffect(() => {
    const preloadImages = () => {
      let loadedCount = 0;
      const totalImagesToLoad = totalPages;
      
      for (let i = 1; i <= totalPages; i++) {
        const img = new Image();
        const imagePath = `/images/test${i}.png`;
        
        img.src = imagePath;
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          if (loadedCount === totalImagesToLoad) {
            setIsLoading(false);
          }
        };
        img.onerror = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          if (loadedCount === totalImagesToLoad) {
            setIsLoading(false);
          }
        };
      }
    };
    
    preloadImages();
  }, [totalPages]);

  // Calculate dimensions to ensure no scrolling is required
  const getBookDimensions = () => {
    // Calculate the available space, accounting for header, buttons, and padding
    const headerHeight = 80; // Approximate space for the header
    const buttonsHeight = 60; // Approximate space for the navigation buttons
    const padding = 30; // Some padding to prevent touching the edges
    
    // Calculate available height for the book
    const availableHeight = windowHeight - headerHeight - buttonsHeight - padding;
    
    // Calculate available width (with some margin)
    const availableWidth = windowWidth - 40;
    
    // For landscape orientation (11" x 8.5")
    const aspectRatio = 8.5 / 11;
    
    let finalWidth, finalHeight;
    
    // Calculate dimensions based on available height
    finalHeight = availableHeight;
    finalWidth = finalHeight / aspectRatio;
    
    // If width is too large, constrain by width instead
    if (finalWidth > availableWidth) {
      finalWidth = availableWidth;
      finalHeight = finalWidth * aspectRatio;
    }
    
    console.log(`Book dimensions: ${finalWidth}x${finalHeight}`);
    console.log(`Window dimensions: ${windowWidth}x${windowHeight}`);
    console.log(`Available space: ${availableWidth}x${availableHeight}`);
    
    return { 
      width: finalWidth, 
      height: finalHeight 
    };
  };

  const { width, height } = getBookDimensions();

  const nextButtonClick = () => {
    if (book.current && pageNumber < totalPages + 1) {
      book.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (book.current && pageNumber > 0) {
      book.current.pageFlip().flipPrev();
    }
  };

  const onPage = (e) => {
    setPageNumber(e.data);
  };

  // Container style to ensure it fits in viewport
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden' // Prevent scrolling
  };

  // Book container style
  const bookContainerStyle = {
    width: `${width}px`,
    height: `${height}px`,
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      {/* Header - kept minimal */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold">Design Catalog</h1>
        <p className="text-sm text-gray-600">Spring/Summer 2025</p>
      </div>
      
      {isLoading ? (
        <div className="flex-grow flex flex-col justify-center items-center">
          <p className="text-xl mb-4">Loading catalog...</p>
          <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${(imagesLoaded / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex justify-center items-center">
          <div className="perspective-1500" style={bookContainerStyle}>
            <HTMLFlipBook
              ref={book}
              width={width}
              height={height}
              size="stretch"
              minWidth={width * 0.8}
              maxWidth={width * 1.2}
              minHeight={height * 0.8}
              maxHeight={height * 1.2}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onPage}
              className="shadow-xl"
              startPage={pageNumber}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Front Cover */}
              <Cover>
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <h1 className="text-4xl font-bold mb-4">Design Catalog</h1>
                  <p className="text-xl italic">Spring/Summer 2025</p>
                </div>
              </Cover>

              {/* Image Pages */}
              {Array.from(new Array(totalPages), (_, index) => (
                <Page key={index} number={index + 1}>
                  <div className="h-full w-full flex items-center justify-center">
                    <img 
                      src={`/images/test${index + 1}.png`}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Page>
              ))}

              {/* Back Cover */}
              <Cover>
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <h2 className="text-2xl font-bold mb-4">Thank You</h2>
                  <p className="text-lg mb-6">We look forward to your feedback</p>
                </div>
              </Cover>
            </HTMLFlipBook>
          </div>
        </div>
      )}

      {/* Navigation buttons - fixed bottom positioning */}
      <div className="py-2 flex justify-center gap-4">
        <button 
          onClick={prevButtonClick}
          disabled={pageNumber === 0}
          className="px-6 py-1 bg-gray-800 text-white rounded disabled:bg-gray-400 text-lg"
        >
          Previous
        </button>
        <span className="self-center">
          Page {pageNumber + 1} of {totalPages + 2}
        </span>
        <button 
          onClick={nextButtonClick}
          disabled={pageNumber === totalPages + 1}
          className="px-6 py-1 bg-gray-800 text-white rounded disabled:bg-gray-400 text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;