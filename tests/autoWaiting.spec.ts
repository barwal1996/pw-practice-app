import {test,  expect }  from "@playwright/test";

test.beforeEach(async({page},testInfo)=> {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()

    //if i want to apply time to all test in my testSuite
    testInfo.setTimeout(testInfo.timeout+1000)

})




test('autoWaiting',async ({page})=>{
    const successBtn=page.locator('.bg-success')
    //await successBtn.click()

    const text= await successBtn.textContent()

    expect(text).toEqual('Data loaded with AJAX get request.')

    //method which doesnt support autoWait , we can implement separete way for them like below 
    await successBtn.waitFor({state:"attached"})
    const textAll = await successBtn.allTextContents()
    expect(textAll).toEqual('Data loaded with AJAX get request.')

    //default waitTime is 5 sec for wait in PW
    await expect(successBtn).toHaveText('Data loaded with AJAX get request.',{timeout:20000})
})

test('alternative wait',async ({page}) =>{
    const successBtn=page.locator('.bg-success')
//wait for element 
    //await page.waitForSelector('.bg-success')

//wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')


//wait for network calls to be completed ( not recommended)
    await page.waitForLoadState('networkidle')

    const text= await successBtn.textContent()
    expect(text).toEqual('Data loaded with AJAX get request.')

})


test('timeOuts ',async ({page})=>{
    //if my test is taking much time thatn other than i can use below functionality too
    //test.setTimeout(16000)
    test.slow()  // this will increase the time 3 times 
    const successBtn=page.locator('.bg-success')
    await successBtn.click()
})