'use strict';

import { handler, cleanEmail } from '../index.mjs';
import { expect } from 'chai';
import fs from 'fs';

function setupEnv() {
    process.env.AWS_REGION = 'us-west-2';
}

describe('openai-chat handler tests', () => {

    before(function() {
        setupEnv();
    });

    it('role - email parser - handler gets successful response', async () => {
        setupEnv();
        const event = JSON.parse(fs.readFileSync(process.cwd() + '/src/openai-chat/test/events/api-gateway-event.json'));
        const email = fs.readFileSync(process.cwd() + '/src/openai-chat/test/events/sample-email.html').toString('utf-8');
        const emailText = cleanEmail(email);

        const prompt = `I want you to analyze this email and tell me the following things:
        1. "brand_name" - The name of the company or person that sent the email.
        2. "banner_image_url" - The link to an image or logo of the company or person, if available.
        3. "location" - An address, city, state and zip code (or whatever is available) or general location provided in the email.
        4. "state_code" - The 2-letter US state code for the state in which the company or person resides.
        5. "sender_description" - A one sentence description of the company or person sending the email and what they are about.
        6. "sender_web_url" - The website url for the company or person.
        7. "sender_tags" - A CSV list of tags to help classify the company or person. Judge the tone of the email and any marketing tactics and branding keywords being used to help classify the sender of the email.
        8. "product_name" - A comma separated list of products this email is offering discounts or promotions on (if any).
        9. "price" - The headline price of the featured item or service being advertised, formatted as a decimal with no dollar signs or whitespace.
        11. "discount" - Any discount or sale terms.
        12. "discount_percent" - If the email offers a percentage discount, the discount percent as a decimal percentage with no percent sign or extra text. "20% Off" should be returned as the decimal "20", for example.
        13. "discount_amount" - If the email offers a discount in dollars, the discount or sale amount as a decimal with no dollar signs or extra text. "$20 off first purchase" should be returned as the decimal "20" for example.
        14. "coupon_code" - The coupon or discount code provided in the email if applicable.
        15. "summary" - A one sentence summary of the email.
        16. "tags" - A list of tag strings to help classify the email. Use the names of products or other key terms that will help classify the email.
        Please return this data as a minified JSON object. Use the tag in quotes for each item as the JSON property name.
        Do not return anything but this minified JSON object. No words or descriptions of your response please, just the JSON object.
        Enclose the key and string values in quotes, unless they are null.
        Here is the email: ${emailText}`;

        event.body = JSON.stringify({ prompt: prompt, role: 'You are an expert at parsing emails and pulling out data points' });
        const result = await handler(event, null)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.payload).to.be.an('object');
        expect(response.payload.summary).to.be.a('string');
    });
});