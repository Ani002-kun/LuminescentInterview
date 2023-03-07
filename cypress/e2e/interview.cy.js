describe('template spec', () => {
  beforeEach(()=>{
   cy.visit('http://localhost:4200/')
   cy.wait(2000)
  })

context('Gallary view',()=>{
  it('Validating the landing page', () => {
    cy.get('h1').contains('Pictures (30)')
    cy.get('[class="image-thumb"]').should('have.length',30)
  })

  it('Validating the size of images in image cards with index',()=>{
    cy.get('[class="image-thumb"]').each(($el, index, $list)=>{
      cy.wrap($el).find('img').wait(100).invoke('css', 'height').then(str => parseInt(str)).should('eq', 200);         // verifying the height of the gallary view image, it should be the same for every card.
      cy.wrap($el).invoke("text").should('include',index+1)                                                            //verifying the numbering of the image
    })
  })
   
  // it.only('Ve`rifying the outside download button',()=>{
  //   cy.get('[class="image-thumb"]').each(($el, index, $list)=>{               ** For some reason when clicking download button on cypress the page was not loading fully and failing.
  //     cy.wrap('[class="image-thumb"]').eq(index).find('.button').click()
  //   })
  // })

})

 context('Detailed view',()=>{
    it('Validating the big form of images and the text within',()=>{
    cy.get('[class="image-thumb"]').each(($el, index, $list)=>{

      cy.get('[class="image-thumb"]').eq(index).invoke("text").then((text)=>{ 
        let a = text.split('D');
        let outsideText=a[0];
        cy.get('[class="image-thumb"]').eq(index).click().wait(2000)
        cy.get('img').invoke('css', 'height').wait(2000).then(str => parseInt(str)).should('eq', 500);            // this will measure the height of the image in detailed view.
        cy.wait(3000) 
        cy.get('.info-container > :nth-child(1)').invoke('text').should('have.text',outsideText)                 //it will match the text present outside with the text and number present on the inside
        cy.get('a').should('exist').and('have.text','Back').click()
        cy.url().should('eq','http://localhost:4200/')
        cy.wait(3000)
      })
    })
  })

  it('Verifying the gallary image with the detailed image',()=>{
    cy.get('[class="image-thumb"]').each(($el, index, $list)=>{
      cy.wrap($el).as('clickImage')
      cy.get('img').eq(index).should('have.attr', 'src').then((text)=>{
          let outsideImage = text;
          cy.get('[class="image-thumb"]').eq(index).click({force:true}).wait(2000)
          cy.get('img').should('have.attr', 'src').should('include',outsideImage)      //if the images are not same it will fail
          cy.get('a').should('exist').and('have.text','Back').click()
      })
    })
  })

    it('Verifying the download button in detailed view',()=>{
        cy.get('[class="image-thumb"]').each(($el, index, $list)=>{
          cy.wrap($el).as('clickImage')
          cy.get('[class="image-thumb"]').eq(index).click().wait(2000)
          cy.get('img').should('have.attr', 'src').then((text)=>{
            let b=text.split('/')                                     
            cy.log(b)
            let imageHeight = b[5]                                                    //since the image source contains the absolute height of the image we can use to get the size of the image.
            if(imageHeight>2000){                                                     //if the image height is less than 2000px it will fail 
              cy.get('.button').should('exist').should('have.text','Download')
            }
            else{
              cy.get('.button').should('not.exist')
            }
            cy.get('a').click().wait(3000)
          })
        })

    })
  
  })

})
