const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const ProgressBar = require('progress');

const url = 'https://icons.getbootstrap.com/';

async function scrapeIcons() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data); 

    const icons = [];
    const totalIcons = $('li[data-name]').length;
    const bar = new ProgressBar(':bar :current/:total', {
      total: totalIcons,
      width: 40,
      complete: '=',
      incomplete: ' ',
    });

    const iconPromises = [];

    $('li[data-name]').each((index, element) => {
      const iconClass = $(element).find('i').attr('class');
      const iconName = $(element).find('.name').text().trim();

      const iconData = {
        iconClass,
        iconName,
      };

      iconPromises.push(Promise.resolve(iconData));

      bar.tick(); 
    });

    const allIcons = await Promise.all(iconPromises);

    const sortedIcons = allIcons.sort((a, b) => a.iconName.localeCompare(b.iconName));

    fs.writeFileSync('icons.json', JSON.stringify(sortedIcons, null, 2), 'utf-8');
    console.log('Scraping selesai dan data disimpan ke icons.json');
  } catch (error) {
    console.error('Error scraping data:', error);
  }
}

scrapeIcons();
