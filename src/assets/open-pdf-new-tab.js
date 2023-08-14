/*
    
    anchor tag pdfs target attribute _blank add
      
    Version     : 0.1d0
      
    SS Versions : 7.1, 7.0
      
    By          : Thomas Creedon < http://www.tomsWeb.consulting/ >
      
    no user serviceable parts below
      
*/
      
    window.addEventListener ( 'DOMContentLoaded', ( ) => {
      
        const elements = document.querySelectorAll ( '[href$=".pdf"]' );
        
        elements.forEach ( ( element ) => {
        
            element.setAttribute ( 'target', '_blank' );
          
        } );
          
    } );
        
/* end anchor tag pdfs target attribute _blank add */