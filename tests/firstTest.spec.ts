import {test,  expect }  from "@playwright/test";

test.beforeEach(async({page})=> {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

})

test('Locator syntax rules',async({page})=> {
    //by tag name
    page.locator('input')

    //by id name 
    page.locator('#inputEmail')

    //by class 
    page.locator('.shape-rectangle')

    //by attribute 
    page.locator('[placeholder="Email"]')

    //by class value 
    page.locator('[class="value"]')

    //combine different selectors 
    page.locator('input[placeholder="Email"][nbinput]')    // do not put any space between them if you want to combine 

    //by xpath (Not recommended)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match 
    page.locator(':text("Using")')

    //by exact text match 
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({page})=>{
   await  page.getByRole('textbox',{name:"Email"}).first().click()
   await  page.getByRole('button',{name:"Sign In"}).first().click()
   await page.getByLabel('Email').first().click()
   await page.getByPlaceholder('Jane Doe').fill("Amit")
   await page.getByTestId('signIn').click()


})

test('locating child elements ',async ({page})=>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button',{name:"Sign in"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()  // less prefer because it can be change

})


test('locating parent elements', async ({page})=>{
    await page.locator('nb-card',{hasText:"Using the Grid"}).getByRole('textbox',{name:"Email"}).first().click()
    await page.locator('nb-card',{has:page.locator("#inputEmail1")}).getByRole('textbox',{name:"Email"}).first().fill("Amit")


    await page.locator('nb-card').filter({hasText:"Basic form"}).getByRole('textbox',{name:"Email"}).first().fill("Deep")
// use filter if we want to use user facing locators in PW
    await page.locator('nb-card').filter({has:page.locator('.status-danger')}).getByRole('textbox',{name:"Email"}).first().click()

    await page.locator('nb-card').filter({has:page.locator('nb-checkbox')}).filter({hasText:"Sign in"}).getByRole('textbox',{name:"Email"}).first().click()

    await page.locator(':text-is("Using the Grid').locator('..').getByRole('textbox',{name:"Email"}).first().click()
//xpath 
})

test('ReUsing the locators',async ({page})=>{
    const basicForms= page.locator('nb-card').filter({hasText:"Basic form"})
    const emailField =basicForms.getByRole('textbox',{name:"Email"})
    await basicForms.getByRole('textbox',{name:"Email"}).first().fill("test@test.com")
    await basicForms.getByRole('textbox',{name:"Password"}).first().fill("Welcome123")
    await basicForms.locator('nb-checkbox').click()
    await basicForms.getByRole('button').click()

    await expect(emailField).toHaveValue("test@test.com")

})

test('extracting values',async ({page})=>{
    //single test value
    const basicForms= page.locator('nb-card').filter({hasText:"Basic form"})
    const buttonText = await basicForms.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all test values 
    const allRadioBtnvalue=await page.locator('nb-radio').allTextContents()
    console.log('check'+allRadioBtnvalue.length)
    expect(allRadioBtnvalue).toContain("Option 1")

    //input value
    const emailField=basicForms.getByRole('textbox',{name:"Email"})
    await emailField.fill("test@test.com")
    const emailValue =await  emailField.inputValue()

    expect(emailValue).toEqual("test@test.com")

    const placeholderValue=await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

})


test('assertions',async ({page})=>{
    //generalAssertions
    const value =5
    expect(value).toEqual(5)


    const basicFormsBtn= page.locator('nb-card').filter({hasText:"Basic form"}).locator('button')
    const btnValue= await basicFormsBtn.textContent()
     expect(btnValue).toEqual('Submit')

     //locator assertions
    await expect(basicFormsBtn).toHaveText('Submit')

    //soft assertion 
    await expect.soft(basicFormsBtn).toHaveText('Submit')
    await basicFormsBtn.click()

})






// test.describe('suite1', () => {
//     test.beforeEach(async({page})=> {
//         await page.getByText('Forms').click()
//     })
//     test('the first test1',async ({page})=> {
//         await page.getByText('Form Layouts').click()
//     })
    
//     test('navigate to Datepicker1',async ({page})=> {    
//         await page.getByText('Datepicker').click()
//     })
// })

// test.describe('suite2', () => {
//     test.beforeEach(async({page})=> {
//         await page.getByText('Auth').click()
//     })
// })