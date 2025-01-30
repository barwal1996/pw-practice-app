import {test,  expect }  from "@playwright/test";
import { delay } from "rxjs-compat/operator/delay";
import { timeout } from "rxjs-compat/operator/timeout";

test.beforeEach(async ({page},testInfo)=>{
    await page.goto('http://localhost:4200/')
    testInfo.setTimeout(testInfo.timeout+1000)

})

test.describe('Form layout page ', ()=>{
    test.beforeEach(async ({page})=>{
        await page.getByText('Forms').click()
        await page.getByText('Form layouts').click()
        
    })

    test('input fields',async ({page})=>{
        const useingTheGridEmailInput = page.locator('nb-card',{hasText:"Using the Grid"}).getByRole('textbox',{name:'Email'})
        await useingTheGridEmailInput.fill('tamit70@gmail.com')
        await useingTheGridEmailInput.clear()

        await useingTheGridEmailInput.pressSequentially('tamit70@gmail.com',{delay:300})

        //generic assertions 
        const inputValue=   await useingTheGridEmailInput.inputValue()

        expect(inputValue).toEqual('tamit70@gmail.com')

        //locator assertion 
        await expect(useingTheGridEmailInput).toHaveValue('tamit70@gmail.com')
    })

    test('radio buttons ',async ({page})=>{
        const usingGridForm = page.locator('nb-card',{hasText:"Using the Grid"})
        //await usingGridForm.getByLabel('Option 1').check({force:true}) // force True used for disabling the checck mentioned in code for disabling it 

        await usingGridForm.getByRole('radio',{name:"Option 1"}).check({force:true})

        const radioStatus = await usingGridForm.getByRole('radio',{name:"Option 1"}).isChecked()

        expect(radioStatus).toBeTruthy()

        await expect(usingGridForm.getByRole('radio',{name:"Option 1"})).toBeChecked()

        await usingGridForm.getByRole('radio',{name:"Option 2"}).check({force:true})

        expect(await usingGridForm.getByRole('radio',{name:"Option 1"}).isChecked()).toBeFalsy()
    })

    
})

test('CheckBoxes',async ({page})=>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox',{name:"Hide on click"}).check({force:true})
    //await page.getByRole('checkbox',{name:"Hide on click"}).uncheck({force:true})


    const allBoxes = page.getByRole('checkbox')

    for(const box of await allBoxes.all()){
        await box.uncheck({force:true})

        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropDowns',async ({page})=>{
    const dropDownMenu = page.locator('ngx-header nb-select ')
    await dropDownMenu.click()

    page.getByRole('list') //when list has UL tags
    page.getByRole('listitem') //when list has LI tags


    //const optionList =  page.getByRole('list').locator('nb-option')
    
    const optionList = page.locator('nb-option-list nb-option')

    await expect(optionList).toHaveText(["Light","Dark","Cosmic","Corporate"])

    await optionList.filter({hasText:"Cosmic"}).click()

    const header1 = page.locator('nb-layout-header');

    await expect(header1).toHaveCSS('background-color','rgb(50, 50, 89)', { timeout: 15000 })

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark" : "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate":"rgb(255, 255, 255)"
    }
    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText:color}).click()

        await expect(header1).toHaveCSS('background-color',colors[color],{ timeout: 15000 })
        if(color!= "Corporate")
            await dropDownMenu.click()
    }
})

test('toolTips',async ({page})=>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard= page.locator('nb-card',{hasText:"Tooltip Placements"})
    await toolTipCard.getByRole('button',{name:"Top"}).hover()

    page.getByRole('tooltip') //word if our  role have tooltip created

    const tooltip=await page.locator('nb-tooltip').textContent()

    expect(tooltip).toEqual('This is a tooltip')

})

test('Dialog box',async ({page})=>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

   // await page.getByRole('table').locator('tr',{hasText:"mdo@gmail.com"}).locator('.nb-trash').click()

    page.on('dialog',dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')

        dialog.accept()
    })
    await page.getByRole('table').locator('tr',{hasText:"mdo@gmail.com"}).locator('.nb-trash').click()

    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Web tables',async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    // how to get row by any text in this row 

    const targetRow = page.getByRole('row',{name:"twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('40')
    
    await page.locator('.nb-checkmark').click()

    //get the row  based on the value of the  specific column 
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row',{name:"11"}).filter({has:page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('Age').fill("40")
    
    await page.locator('.nb-checkmark').click()

    await expect(targetRowById.locator('td').nth(5)).toHaveText('mark@gmail.com')

    //3 test filter of table 
    const ages =["20","30","200"]
    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill('age')
        await page.waitForTimeout(500)
        const ageRow = page.locator('tbody tr')

        for(let row of await ageRow.all()){
            const cellValue= await row.locator('td').last().textContent()

            if(age=="200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }
            else{
                //expect(cellValue).toEqual(age) 
            }
        }

        // await page.locator('.nb-checkmark').click()
    }
})
test('data picker',async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInput = page.getByPlaceholder('Form Picker')
    await calendarInput.click()

    //Js DateObject
    let date = new Date()
    date.setDate(date.getDate()+20)

    console.log("date is"+date)
    const expectedDate = date.getDate().toString()


    const expectedMonthShot=  date.toLocaleString('En-US',{month:'short'})
    const expectedMonthlong=  date.toLocaleString('En-US',{month:'long'})

    const expecteedYear = date.getFullYear()

    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expecteedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthlong} ${expectedDate}, ${expecteedYear}`

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear= await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate,{ exact: true }).click()
    //await expect(calendarInput).toHaveValue('Jan 29, 2025')
    await expect(calendarInput).toHaveValue(dateToAssert)

})
