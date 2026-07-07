import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';
import path from 'path';

const SQ   = 'https://images.squarespace-cdn.com/content/v1/5b6d00a59d5abbcae48fad24/';
const OUT  = './assets/images/agents';

const LEADERSHIP = [
  ['hedda-parashos',              '1691096774657-QH157JU7WONE2STC8SHA/image008+%282%29.jpg'],
  ['tom-parashos',                '1595366676727-NPZI9RNL2W8D2BBA84PF/Parashos%2C+Tom+e-8276a.jpg'],
  ['britney-bartlett',            '1691007599254-LSDBS6E4LK143DBIFY71/image008+%281%29.jpg'],
  ['michael-divita',              '1740155754469-Q0RISX8IY4QSZLJHVFHC/83230156_172430979_mike_headshot.jpeg'],
  ['michael-guzman',              '1647527534903-U1RVSP01ZNNBEBEHPHT6/MichaelGuzman_83230158_GuzmanMichael.jpg'],
  ['nicole-ward',                 '1715630308184-GTWO8MCNXWUD0TFHZ3VM/NicoleWard_83230158_nward.png'],
  ['danielle-patterson',          '1728925524716-EPJQN910PTWWPX1YWKMG/Danielle+Patterson.jpg'],
  ['lisa-florendo',               '1752239116810-X5U73FBQ5G593F8FKKOX/172430981_lisa_florendo_headshot.png'],
  ['kelly-chan',                   '1769210814346-IMR4HI855GJD5KSROAR2/172430979_kelly_bio_pic.jpg'],
  ['fermin-perez',                '1769211540334-O5737GE57VPH5KR22WX2/172430981_fermin_bio_pic.jpg'],
];

const AGENTS = [
  ['erick-salgado',               '1595366445849-B7H7ZKTIUWJ402Y2PD3A/_MG_7215.jpg'],
  ['melissa-maxwell',             '1717521639842-C7LKMUCXST2ES606R96B/MelissaMaxwell_152392217_melissanewpic.jpg'],
  ['patty-aguilar',               '1595366654358-TGW81XVKDQCMZBGE0EVD/palisade-8258.jpg'],
  ['deborah-trevino',             '1751008744376-XRVRESYKYWZPXI6BUKYU/172430979_deb_new_profile_pic.jpg'],
  ['sarah-bautista',              '1595367019905-2WIPGZVQBR9DYHQVSEB9/Head+Shot2.jpg'],
  ['piper-stein',                 '1688492898865-1TOSR0Z6X8YBMK5ADZ6X/cropped+pic.jpg'],
  ['jason-wallace',               '1598377015759-DW2M2QRVHCTFCNDFDREY/JasonWallace_83230158_WallaceJason.jpg'],
  ['mariko-tortolero',            '1774467665243-SUPCSZFGD5FTYKCACLST/172430979_mariko_headshot.png'],
  ['eric-hayman',                 '1606178591350-J984P876R6T3MIZBK77U/Eric+Hayman+headshot.jpg'],
  ['keith-agnello',               '1606177973335-2CWHN0SM2J7R43SGC5EC/Keith+Agnello+headshot.jpg'],
  ['vanda-fernandes',             '1604364116754-4ZK8C8FGSOUENSE7CXIO/VandaFernandes_83230158_VandaFernandes.jpg'],
  ['patty-samii',                 '1622650782044-ZLSYMYPO48FALR561VDT/Patty.png'],
  ['robby-gmur',                  '1622152174208-LVYGLTT4B6FTM6PJ0LKT/RobbyGmur_83230158_GmurRobert.jpg'],
  ['brandy-bell',                 '1630375022032-ODQ1QAO4P9N5E5CDRG04/BrandyBell_83230158_Headshot.jpg'],
  ['hervin-ugalde',               '1640807291047-3I7M4M2T2IRP9B63VZS8/Hervin+Ugalde.jpg'],
  ['ivan-butrus',                 '1643753634435-3PEG761VCXKW8UH95SCX/IvanButrus_83230158_Headshot.jpg'],
  ['anh-lam',                     '1644607035708-7Y2O8TQT8MY9B15R7S0I/AnhLam_83230158_Headshot.jpg'],
  ['katya-schumaker',             '1780084856609-0GG0F4XVTN1GHAVIK129/renditionDownload+%2812%29.jpg'],
  ['meghan-mcnutt',               '1658583270961-ZIBXXH98CD44G3506DK9/MeghanMcNutt_83230158_MeghanMcnutt.jpg'],
  ['debbie-lawes',                '1658464054562-I2Z4EUM6P5AXWE6Q2BQJ/Debbie+Lawes.jpg'],
  ['martina-toma',                '1660658966356-ZMNO7M8DYVTDE52A3TTR/MartinaToma_83230158_Headshot.jpg'],
  ['alexandra-polles',            '1662173342917-3STN6JY717REW5AO20JU/AlexandraPolles_83230158_AlexandraHS.jpg'],
  ['fia-ierino',                  '1628894553892-RMW41LINA3ZX9VGBZYJ0/FiaIerino_83230158_FiaIerino.jpg'],
  ['diana-beezley',               '1666997937661-L0KXATUD14ZWVT2VEX80/DianaBeezley_83230164_Headshot.jpg'],
  ['lyna-rawlings',               '1669394047775-PX2EWG1FQRWGRVEGNXO2/Lyna+Rawlings.jpg'],
  ['yvonne-mulgrew',              '1674782518845-70VJ4FOF804QS07Z11QY/YvonneMulgrew_83230158_0002Yvonne_new2Copy.jpg'],
  ['allison-asher',               '1675701634484-67IO0KRI4ZPA3YUDHF7K/AllisonMarklein_83230158_Screenshot20230127130907+%281%29.png'],
  ['alan-luken',                  '1680652158234-6VR5LSBGK75MXDP0JQOX/Alan+Luken.jpg'],
  ['delilah-bejarano-armendariz', '1682029832785-LMAQX7JOE8IG8FKGHOSA/DelilahBejarano_83230158_HeadshotBejaranoDelilah.jpg'],
  ['jaymie-santiago',             '1742465954532-M8BV0WUYKTB6IHIF477C/172430979_jaymieheadshot2.png'],
  ['jodi-kirkwood',               '1684190601277-9EARMUO4JW8LU6BRTHON/JodiKirkwood_83230158_121F33QsRIqIeBCSS5iM_IMG_6002.jpg'],
  ['marla-drexler',               '1694203022355-2MODTXNHJ4KESNTJW1O9/MarlaDrexler_83230158_MarlaDrexlerHeadshot2023.JPG'],
  ['lacy-mcfarland',              '1694537118800-OME1C434BP1Y1JEVZSKL/LacyMcFarland_83230158_McFarlandLacy.jpeg'],
  ['renata-rios',                 '1699650710353-ZAPY38MU6POMO64HUI94/RenataRios_83230158_hoCAywaDQS6C9VvfgLrk_headshot.jpg'],
  ['juanito-so-jr',               '1699958943910-XA7LKV5SSLRJOV0JOYAC/JRJuanitoSoJr._83230158_SoJR.jpeg'],
  ['kalen-esguerra',              '1703187731352-XX83DOIXXEVIZJYG8F4R/Kalen+Esguerra.jpg'],
  ['debbie-no',                   '1703188608353-3MK1DSH3GNVA8E4675M2/Debbie+No.jpg'],
  ['chip-morgan',                 '1706652258527-48916RAH0K1HNINX7KSQ/83230158_mDzkwlXbRRqjgBGJcm6X_Headshot.jpg'],
  ['daniel-kappler',              '1708981792448-GQ20EU0KOQ6AKG8EW8O1/DanielKappler_83230158_HeadshotKapplerDaniel.jpg'],
  ['diane-van-korlaar',           '1708991346197-4QMSPQEBTNC1ESO20H8N/83230158_Headshot-Diane+Van+Korlaar.jpg'],
  ['ryan-stein',                  '1711560732444-47QKSXDW3HRYVM97ARE7/Ryan+Stein.jpg'],
  ['brandon-le',                  '1715969501166-1Q9NLDLQXO50H2WB8DYP/BrandonLe_83230158_BrandonLeHeadshot.jpg'],
  ['zach-campbell',               '1718387401226-GFVQ77T0UOJNQQD4BDQH/Zach+Campbell.jpg'],
  ['aubrey-foulk',                '1718388882157-SFHNVMN9MHC7LGC7SLQ2/AubreyFoulk_83230158_aubreyheadshot.jpeg'],
  ['jeremy-mchone',               '1724953716285-0YAJ194IDU4UQ0AKKT63/Jeremy+McHone.png'],
  ['laura-pachlin',               '1727101346283-BV66D6LO229AOQKNSZQ1/83230156_172430981_laura_pachlin_headshot.jpg'],
  ['samuel-minero',               '1727217442751-RJIN0JYHYNME6CAYTFGU/83230156_172430981_sam_minero_headshot.jpeg'],
  ['jim-stengel',                 '1730246250834-J9W9TALWPJLDAX2IGY1C/83230156_172430981_head_shot_jim+%281%29.jpg'],
  ['brandon-khieu',               '1730408858695-77ZR9ZXPBMO3UTZNVAPS/Brandon+Khieu.jpg'],
  ['mona-hassan',                 '1735854579323-FX5JEO8CYCIHPQ14IJTC/83230156_172430981_monaheadshot3.jpg'],
  ['kirsten-blessum',             '1736353788373-6NF97VWKU41RAN5DS3N9/Kirsten+Blessum.jpg'],
  ['wally-dally',                 '1738003366247-RF1FBGT6OT6RRP9M9N6G/172430981_wally_daly.png'],
  ['devyn-iglehart',              '1738254524464-R8ZNTIGZVLG58M4Q7JUQ/83230156_172430981_e98bebed27d2d14c9bef4b25e306b67ch_l.jpg'],
  ['chris-nguyen',                '1743101668870-NX2XEUPNJBJW105QENG6/83230156_172430981_chris_nguyen_headshot.jpg'],
  ['jared-lawrence',              '1743110506029-UOA8SZP17RITNUTJQUW4/Jared+Lawrence.jpg'],
  ['jonathan-cohen-kurzrock',     '1745871104564-ZLO57VHN1TLPDG1FQO36/83230156_172430981_jck.png'],
  ['chittra-cruz',                '1745457745716-F55UPFR41D7SSA928AHF/83230156_172430981_chittra_headshot.jpeg'],
  ['kelsey-barry-farnsworth',     '1746510109054-AZKUBHVPQQQO8RTNJO0K/172430981_kelsey_barry_photo.jpg'],
  ['edelia-eveland',              '1752239955593-FP1QETQD0RVR74WESJBG/172430981_edelia_eveland_headshot.png'],
  ['sabrina-alvarado',            '1753498207530-5D0F8BF35LMSCHA0KSDS/83230156_172430981_6909_sd_headshots_forsocialmedia.jpg'],
  ['andrew-lopez',                '1754580608765-ICWBA1QQPNXO53YJUUEV/172430981_andrew_lopez_headshot-centered.jpg'],
  ['taylor-schunk',               '1754980779724-NCBXEX7XE4ATCQP3ZQRE/Taylor+Schunk.jpg'],
  ['louis-goletto',               '1755719064763-HVVSO4LE1D4NYRPLRI7G/172430981_louis_headshot_1.png'],
  ['atzay-estrada',               '1763140921942-TQPY49MKN2OIKYQK8MR4/83230156_172430981_pr_headshot.jpg'],
  ['cynthia-mayorga',             '1766420041080-85P91WNHGXTRZRYHYDZQ/83230156_172430981_cynthia_headshot.png'],
  ['casie-o-donnell',             '1766526754180-B5HALZV11FPTEGJFTDSM/83230156_172430981_casie_headshot.jpg'],
  ['sergio-yturralde',            '1767655514260-M1N0O8YTFQHSB62EOJHY/172430981_img-6818.jpg'],
  ['melissa-campos',              '1769109832697-XOARV3M84EZQTVDKNVU7/172430981__dsc9999.jpg'],
  ['emma-dearing',                '1769736472131-5MI93MQX54T0CCREE2FR/Emma+Dearing.jpg'],
  ['tristen-campanella',          '1771441909321-4OL84XUXAE3NZB1QH7NN/172430981_tristen.png'],
  ['rachel-ohara',                '1771889916432-OCWC0RCTEWIQ9TRWA71I/83230156_172430981_img_7252.png'],
  ['jennifer-crosby',             '1771890185576-63LEOITVSMJ3F4MHYT2U/83230156_172430981_jennifer_crosby.jpg'],
  ['glennis-dawson',              '1771968831548-ZR16WKANMP797GK9J3NF/83230156_172430981_glennis_headshot.jpg'],
  ['gina-romeo',                  '1776282549966-9BPX2YDLR398CRO0W32K/172430979_gina_headshot.jpg'],
  ['corinne-mauro',               '1771438544337-IECYTH4UDNO3OSBDOY24/172430981_corinne.jpg'],
  ['jules-marchisio',             '1771442458226-8WTMSTY2Y0PONF8T0FFA/172430981_jules_marchisio.jpg'],
  ['greg-lathem',                 '1773191937493-I75XQDMDTJ6I263E0BQR/172430981_greg_-_headshot.jpeg'],
  ['james-mcnab',                 '1773772434575-A6ZAOYTD7IHDFIXFXM4X/83230156_172430981_james_headshots17.jpeg'],
  ['jarrod-norris',               '1775234627102-K7MEB28GOXX4UGAFQSWT/Jarrod+Norris.jpg'],
  ['hannah-ohman',                '1779141795272-3GN78IUU8PEH62295Z2I/83230156_172430981_headshot_preferred_2026__hannah_ohman.png'],
  ['katie-lussier',               '1776381686051-OUZBKLXCX50Z9YUISP9S/83230156_172430981_katie_headshot.jpg'],
  ['john-verdin',                 '1779384387109-9UUBQ35YXO0XDCMO7RRX/172430981_john_verdin_headshot.jpg'],
];

const ALL = [...LEADERSHIP, ...AGENTS];

function extOf(imgPath) {
  const decoded = decodeURIComponent(imgPath);
  const m = decoded.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return m ? '.' + m[1].toLowerCase().replace('jpeg','jpg') : '.jpg';
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      pipeline(res, file).then(resolve).catch(reject);
    }).on('error', reject);
  });
}

let ok = 0, fail = 0;
for (const [slug, imgPath] of ALL) {
  const ext  = extOf(imgPath);
  const dest = path.join(OUT, slug + ext);
  if (existsSync(dest)) { console.log(`skip  ${slug}${ext}`); ok++; continue; }
  const url  = SQ + imgPath;
  try {
    await download(url, dest);
    console.log(`ok    ${slug}${ext}`);
    ok++;
  } catch (e) {
    console.error(`FAIL  ${slug}: ${e.message}`);
    fail++;
  }
}
console.log(`\nDone: ${ok} saved, ${fail} failed.`);
