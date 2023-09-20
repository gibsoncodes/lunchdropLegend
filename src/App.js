import logo from './logo.svg';
import './App.css';
import {useEffect, useState, useTransition} from "react"
import FormattedSubs from './FormattedSubs';

import jmBottle from "./assets/jersey-mikes_bottle.png";
import jmHat from "./assets/jersey-mikes_cap.png";
import eyes from "./assets/jersey-mikes_eye.png";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {

    const jmSubsLegend = {

        // note -- spellings here are intentional
        // ex.    when checking to see if the order has no tomatoes 
        // it is safer to see if the lunchdrop supplied text contains tomato instead of tomatoes
        // this is because lunchdrops supplied text contains many irregularities and sometimes supplies tomatoe, tomatos, or other variations.

        hotSubs: [16, 17, 19, 26, 31, 42, 43, 44, 55, 56, 64, 65, 66],

        hotSubStandards: {
            16: [["onion", "- grl o's"], ["pepper", "- grl peps"]],
            17: [["onion", "- grl o's"], ["pepper", "- grl peps"]],
            19: [["barbecue", "- bbq"], ["bbq", "- bbq"], ["sauce", "- bbq"]],
            26: [["lettuce", "- lettuce"], ["tomato", "- tomato"], ["ranch", "- ranch"], ["bacon", "- bacon"]],
            31: [["lettuce", "- lettuce"], ["tomato", "- tomato"], ["mayo", "- mayo"]],
            42: [["onion", "- grl o's"], ["pepper", "- grl peps"], ["mayo", "- chp mayo"]],
            43: [["onion", "- grl o's"], ["pepper", "- grl peps"], ["mayo", "- chp mayo"]],
            44: [["lettuce", "- lettuce"], ["tomato", "- tomato"], ["blue", "- blue chz"], ["buffalo", "- buff sauce"], ["franks", "- buff sauce"], ["hot sauce", "- buff sauce"]],
            55: [["onion", "- grl o's"], ["green pepper", "- grl peps"], ["sweet pepper", "-grl peps"],["bell pepper", "-grl peps"], ["jalapeno", "- jal peps"], ["mushroom", "- mush"]],
            56: [["onion", "- grl o's"], ["green pepper", "- grl peps"], ["sweet pepper", "-grl peps"],["bell pepper", "-grl peps"], ["jalapeno", "- jal peps"], ["mushroom", "- mush"]],
            64: [["onion", "- grl o's"], ["pepper", "- green peps"]],
            65: [["onion", "- grl o's"], ["pepper", "- grl peps"], ["mushroom", "- port"], ["port", "- port"]],
            66: [["onion", "- grl o's"], ["pepper", "- grl peps"], ["mushroom", "- port"], ["port", "- port"]],
        },
        mikesWay: ["onion", "lettuce", "tomato", "vinegar", "oil", "oregano", "salt"],
        extras: ["chipot", "chipol", "mayo", "pickle", "banana pepper", "jalapeno pepper", "jalapenos", "cherry pepper relish", "brown mustard", "yellow mustard", "spicy mustard", "honey mustard", "mustard"],
        cheese: ["provolone", "swiss", "american", "cheese"],
        breadtype: [["white", "white"], ["wheat", "wheat"], ["rosemary", "rparm"], ["parmesan", "rparm"], ["spinach", "spinach"], ["gluten", "gf"], ["flour", "white"]],
    }

    const sideItemsCheck = (text) => {
        const sideItems = ["chip", "cookie", "brownie", "soda", "drink"]
        for (let i = 0; i < sideItems.length; i++) {
            if (text.includes(sideItems[i])) {
                return true;
            }
        }
        return false;
    }

    const [rawSubs, setRawSubs] = useState([]);
    const [vinnie, setVinnie] = useState({hat: {}, bottle: {}, eyes: {}, text: {}, vinegar: {}})
    const [jumbled, setJumbled] = useState("");
    const [animationState, setAnimationState] = useState("unset")
    const [vinnieTalk, setVinnieTalk] = useState("")
    document.addEventListener('paste', (e) => {
        e.preventDefault();
        let pasted = e.clipboardData.getData("text/html");
        let txt = e.clipboardData.getData("text");
        let forJumbled = txt.split(" ");
        setJumbled(forJumbled)
        logFormattedText(pasted)
        // setAnimationState("begin");
    })

    // useEffect(() => {
    //     if (animationState === "begin") {
    //         setAnimationState("in progress")
    //         setVinnie({...vinnie, text: {animation: "text-move 2s", animationFillMode: "forwards"}})
    //         setTimeout(() => {
    //             setVinnie(prev => {
    //                 return {...prev, bottle: {animation: "awakenBottle .5s", "animation-fill-mode": "forwards"}, hat: {animation: "awakenHat .5s", animationFillMode: "forwards"}}
    //             })
    //         }, 2000)
    //         setTimeout(() => {
    //             setAnimationState("add eyes")
    //             setVinnieTalk("DAMN SON WHERED YOU FIND THIS!")
    //         }, 2500)
    //         setTimeout(() => {
    //             setVinnieTalk("I MEAN! HEY KIDS... YOU GOT A LUNCHDROP EH.")
    //         }, 6000)
    //         setTimeout(() => {
    //             setVinnieTalk("YOU JUST LEAVE THIS TO OL' VINNIE HERE");
    //             setVinnie(prev => {
    //                 return {...prev,  hat: {animation: "hatSpin 2s", animationFillMode: "forwards"}}
    //             })
    //         }, 10000)
    //         setTimeout(() => {
    //             setVinnie(prev => {
    //                 return {...prev, vinegar: {animation: "juicedVin 6s", animationFillMode: "forwards", display: "block"}, bottle: {animation: "juiced 6s", animationFillMode: "forwards"}, text: {animation: "text-purple 8s", "animation-fill-mode": "forwards", top: "80%"}, hat: {display: "none"}, eyes: {left: {animation: "juicedEyesLeft 6s", animationFillMode: "forwards"}, right: {animation: "juicedEyesRight 6s", animationFillMode: "forwards"}}}
    //             })
    //         }, 12000)
    //         setTimeout(() => {
    //             setVinnieTalk("AHH MUCH BETTER KIDS");
    //             setVinnie(prev => {
    //                 return {...prev, vinegar: {display: "none"}}
    //             })
    //             setAnimationState("complete")
    //         }, 20000)
    //         setTimeout(() => {
    //             setVinnieTalk("$#%$ MY @#$@#$ HAT");
    //             triggerPrint();
    //         }, 22000)
    //     }
    // }, [animationState])

    const triggerPrint = () => {
        window.print();
    }

    const coldSubSubtractionParse = (currChange, customerSub, mw, currSubNumber) => {
        let changeFound = false;

        // checking mikes way
        for (let j = 0; j < mw.length; j++) {
            if (currChange.includes(mw[j])) {
                customerSub.subtractions.push(mw[j]);
                changeFound = true;
                break;
            }
        }

        // #14 sanitation
        if (!changeFound) {
            if (currChange.includes("green bell pepper") || currChange.includes("green pepper")) {
                if (currSubNumber == 14) {
                    customerSub.subtractions.push("green pepper")
                    changeFound = true;
                }
            } 
        }

        // checking mayo
        if (!changeFound) {
            if (currChange.includes("mayo")) {
                if (currSubNumber == 9 || currSubNumber == 8 || currSubNumber == 1) {
                    customerSub.subtractions.push("mayo");
                }
                changeFound = true;
            } 
        }
        // checking cheese
        if (!changeFound) {
            for (let j = 0; j < jmSubsLegend.cheese.length; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    if (currSubNumber != 1 && currSubNumber != 10) {
                        customerSub.subtractions.push("cheese");
                    }
                    changeFound = true;
                    break;
                }
            }
        }
        // checking bacon
        if (!changeFound) {
            if (currChange.includes("bacon")) {
                if (currSubNumber == 9 || currSubNumber == 8 || currSubNumber == 1) {
                    customerSub.subtractions.push("bacon");
                }
                changeFound = true;
            }
        }
        // cleanup -- occurs when a misspelled, unknown or uncommon subtraction is supplied
        // this text will be moved to the notes section and left for crewmate to decipher.
        if (!changeFound) {
            customerSub.notes = `${currChange}, ${customerSub.notes}`;
        }
    }

    const hotSubSubtractionParse = (currChange, customerSub, currSubNumber) => {
        let changeFound = false;
        let hsub = jmSubsLegend.hotSubStandards[currSubNumber];

        // checking basics. onions peppers etc...
        for (let i = 0; i < hsub.length; i++) {
            if (currChange.includes(hsub[i][0])) {
                customerSub.subtractions.push(hsub[i][1])
                changeFound = true;
                break;
            }
        }

        // checking cheese
        if (!changeFound) {
            for (let j = 0; j < jmSubsLegend.cheese.length; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    customerSub.subtractions.push("cheese");
                    changeFound = true;
                    break;
                }
            }
        }

        // cleanup -- occurs when a misspelled, unknown or uncommon subtraction is supplied
        // this text will be moved to the notes section and left for crewmate to decipher.
        if (!changeFound) {
            customerSub.notes = `${currChange}, ${customerSub.notes}`;
        }

    }

    const coldSubAdditionParse = (currChange, customerSub, mw, xtra, currSubNumber, customerOrder) => {
        let changeFound = false;

        // checking mikes way
        for (let j = 0; j < mw.length; j++) {
            if (currChange.includes(mw[j])) {
                // irrelevant change -- moving on
                changeFound = true;
                break;
            }
        }

        // checking extras 
        if (!changeFound) {
            for (let j = 0; j < xtra.length; j++) {
                if (currChange.includes(xtra[j])) {
                    customerSub.additions.push(xtra[j]);
                    changeFound = true;
                    break;
                }
            }
        }

        // checking cheese
        if (!changeFound) {
            for (let j = 0; j < jmSubsLegend.cheese.length; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    customerSub.additions.push("extra cheese");
                    customerSub.upCharges.push("extra cheese");

                    changeFound = true;
                    break;
                }
            }
        }

        // checking bacon
        if (!changeFound) {
            if (currChange.includes("bacon")) {
                customerSub.additions.push("bacon");
                customerSub.upCharges.push("extra bacon");

                changeFound = true;
            }
        }

        // checking extra meat
        if (!changeFound) {
            if (currChange.includes("meat")) {
                customerSub.additions.push("extra meat");
                customerSub.upCharges.push("extra meat");

                changeFound = true;
            }
        }

        // cleanup -- occurs when a misspelled, unknown or uncommon subtraction is supplied
        // this text will be moved to the notes section and left for crewmate to decipher.
        if (!changeFound) {
            if (currChange.match(/\d/)) {
                customerOrder.sideItems.push(currChange);
            } else {
                customerSub.notes = `${customerSub.notes}, ${currChange}`;
            }

        }
    }

    const hotSubAdditionParse = (currChange, customerSub, currSubNumber, xtra, customerOrder) => {
        let changeFound = false;
        let hsub = jmSubsLegend.hotSubStandards[currSubNumber];
        
        // checking basics. onions peppers etc...
        for (let i = 0; i < hsub.length; i++) {
            if (currChange.includes(hsub[i][0])) {
                if (currChange.includes("bacon") === false && currChange.includes("port") === false) {
                    changeFound = true;
                } 
                //  else irrelevant addition -- moving on
                break;
            }
        }

        // checking extras 
        if (!changeFound) {
            for (let j = 0; j < xtra.length; j++) {
                if (currChange.includes(xtra[j])) {
                    customerSub.additions.push(xtra[j]);
                    changeFound = true;
                    break;
                }
            }
        }

        // checking cheese
        if (!changeFound) {
            for (let j = 0; j < jmSubsLegend.cheese.length; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    customerSub.additions.push("extra cheese");
                    customerSub.upCharges.push("extra cheese");
                    changeFound = true;
                    break;
                }
            }
        }

        // checking bacon
        if (!changeFound) {
            if (currChange.includes("bacon")) {
                customerSub.additions.push("bacon");
                customerSub.upCharges.push("extra bacon");
                changeFound = true;
            }
        }

        // checking extra meat
        if (!changeFound) {
            if (currChange.includes("meat")) {
                customerSub.additions.push("extra meat");
                customerSub.upCharges.push("extra meat");
                changeFound = true;
            }
        }

        // checking portabello 
        if (!changeFound) {
            if (currChange.includes("port")) {
                customerSub.additions.push("port");
                customerSub.upCharges.push("extra port");
                changeFound = true;
            }
        }

        // cleanup -- occurs when a misspelled, unknown or uncommon subtraction is supplied
        // this text will be moved to the notes section and left for crewmate to decipher.
        if (!changeFound) {
            if (currChange.match(/\d/)) {
                customerOrder.sideItems.push(currChange);
            } else {
                customerSub.notes = `${customerSub.notes}, ${currChange}`;
            }
        }
    }

    const bodyOfOrderParse = (element, rawText, customerOrder, customerSub) => {

        let currSubNumber = customerSub.subNumber
        
        if (currSubNumber > 0 && currSubNumber <= 14) {
            customerSub.isColdSub = true;
        } else {
            customerSub.isColdSub = false;
        }
        //  Sub Notes -- done first to make parsing more agreeable.
        if (element.querySelector("em")) {
          let notesText = element.querySelector("em").innerText;
          customerSub.notes = notesText
          rawText = rawText.slice(0, rawText.indexOf(notesText))
        } 
        let toParse = rawText.toLowerCase().split(",");
        
        let mw = jmSubsLegend.mikesWay;
        let xtra = jmSubsLegend.extras;
        for (let i = 0; i < toParse.length; i++) {
            let currChange = toParse[i];

            // handles empty string or punctuation only case.
            if (currChange.length < 2) {
                continue;
            }

            if (currChange.includes("add")) {
                if (customerSub.isColdSub) {
                    coldSubAdditionParse(currChange, customerSub, mw, xtra, currSubNumber, customerOrder);
                } else {
                    hotSubAdditionParse(currChange, customerSub, currSubNumber, xtra, customerOrder)
                }
            } 
            
            else if (currChange.includes("no")) {
                if (customerSub.isColdSub) {
                    coldSubSubtractionParse(currChange, customerSub, mw, currSubNumber);
                } else {
                    hotSubSubtractionParse(currChange, customerSub, currSubNumber)
                }
            }

            // breadtype and cleanup
            else {

                let changeFound = false;
                for (let j = 0; j < jmSubsLegend.breadtype.length; j++) {
                    if (currChange.includes(jmSubsLegend.breadtype[j][0])) {
                        customerSub.subBread = jmSubsLegend.breadtype[j][1];
                        changeFound = true;
                        break;
                    }
                }
                
                // this is the last line of defense. If a match hasnt been determined yet it is likely a side item stuck in the toppings section 
                // or no keywords { NO, ADD } were matched. 
                if (!changeFound) {

                    // checks if any extras were in sub section via number match
                    if (currChange.match(/\d/)) {
                        customerOrder.sideItems.push(currChange);
                        changeFound = true;
                    }

                    if (!changeFound) {
                        // rechecks potentially valid toppings that did not have keyword ADD or NO
                        if (customerSub.isColdSub) {
    
                            // ex. portion of text just says vinegar. we must assume they do not want vinegar if it is a cold sub
                            for (let index = 0; index < mw.length; index++) {
                                if (currChange.includes(mw[index])) {
                                    customerSub.subtractions.push(mw[index]);
                                    changeFound = true;
                                    break;
                                }
                            }
                            if (!changeFound) {
                                // same logic as above assume customer wants to add ban peps if it just says ban peps
                                for (let index = 0; index < xtra.length; index++) {
                                    if (currChange.includes(xtra[index])) {
                                        customerSub.additions.push(xtra[index]);
                                        changeFound = true;
                                        break;
                                    }
                                }
                            }
                        } else {
                            for (let index = 0; index < jmSubsLegend.hotSubStandards.length; index++) {
                                if (currChange.includes(jmSubsLegend.hotSubStandards[index][0])) {
                                    customerSub.subtractions.push(jmSubsLegend.hotSubStandards[index][1]);
                                    changeFound = true;
                                    break;
                                }
                            }
                            if (!changeFound) {
                                // same logic as above assume customer wants to add ban peps if it just says ban peps
                                for (let index = 0; index < xtra.length; index++) {
                                    if (currChange.includes(xtra[index])) {
                                        customerSub.additions.push(xtra[index]);
                                        changeFound = true;
                                        break;
                                    }
                                }
                            }
                        }

                        if (!changeFound) {
                            console.error("could not determine the following text", currChange)
                        }
                    }
                    
                }
            }
        }
    }

    function logFormattedText(pastedText) {
        const orders = [];
        let htmlElement = document.createElement('div');
        htmlElement.id = "mydiv"
        htmlElement.innerHTML = pastedText;
        let formattedElements = htmlElement.querySelectorAll('#mydiv > table > tbody > tr > td');
        for (let i = 0; i < formattedElements.length; i++) {
          let element = formattedElements[i];
          let currId = `order${i+1}`;
          element.id = currId;
          let dontPush = false;
          
          let newOrder = {
            orderName: "",
            subs: [],
            sideItems: [],
            lunchDropName: "",
          };
          let subError = false;

          // Order Name
          if (element.querySelector("table > tbody > tr > td")) {
            let elm = element.querySelector("table > tbody > tr > td");
            let child = elm.querySelectorAll("span");
            child.forEach(chi => {
                elm.removeChild(chi)
            })
            let thisName = elm.innerText;
            let matches = orders.filter(order => {
                return order.orderName === thisName;
            })
            if (matches[0]) {
                dontPush = true;
                newOrder = matches[0];
            }
            newOrder.orderName = elm.innerText;
            if (element.querySelectorAll("table > tbody > tr > td")[1]) {
                let elm2 = element.querySelectorAll("table > tbody > tr > td")[1];
                newOrder.lunchDropName = elm2.querySelector("span").innerText;
            }
            
          }
          if (newOrder.orderName.length === 0 && newOrder.lunchDropName.length === 0) {
            console.log("error")
            newOrder.subError = true;
            newOrder.raw = element.innerText;
            continue;
          } else {
            let removedChild = element.querySelector("table");
            element.removeChild(removedChild);
          }

          // loop to see if there are multiple subs and or side items 

        //   let orderItems = element.querySelectorAll(`#${currId} > ul > li`);
          
        //   for (let j = 0; j < orderItems.length; j++) {
            let currOrderItem = element;
            let textLength = 0;
            let isSideItem = false;
            let newSub = {
                subNumber: 0,
                subSize: "",
                subBread: "",
                isColdSub: true,
                subtractions: [],
                additions: [],
                notes: "",
                upCharges: [],
            };
            

            // Sub Number, Size
  
            if (currOrderItem.querySelectorAll("span")[0]) {
              let safetyCheck = true;
              let breadStats = currOrderItem.querySelectorAll("span")[0].innerText.toLowerCase();
              textLength = breadStats.length;
              breadStats = breadStats.split(" ");
  
              for (let k = 0; k < breadStats.length; k++) {
                  let curr = breadStats[k];
                //   console.log(curr)
  
                  // size -- currently does not check for kids meals // have yet to see if and how lunchdrop supplies this
  
                  if (!newSub.subSize) {
                      let updated = true;
                      if (curr.includes("regular")) {
                          newSub.subSize = "R";
                      } else if (curr.includes("giant")) {
                          newSub.subSize = "G";
                      } else if (curr.includes("large")) {
                          newSub.subSize = "G";
                      } else if (curr.includes("mini")) {
                          newSub.subSize = "M";
                      } else if (curr.includes("wrap")) {
                          newSub.subSize = "WR";
                      } else if (curr.includes("tub")) {
                        newSub.subSize = "TUB";
                      } else if (curr.includes("bowl")) {
                        newSub.subSize = "TUB";
                      } else if (curr.includes("sub")) {
                        if (breadStats[3].includes("bowl") || breadStats[3].includes("tub")) {
                            newSub.subSize = "TUB";
                        } else {
                            updated = false;
                        }
                      } else {
                        updated = false;
                      }
                      if (updated) {
                        continue;
                      }
                  }
  
                  //  number
                  if (newSub.subNumber === 0) {
                      if (curr[0] === "#") {
                          newSub.subNumber = Number(curr.slice(1));
                          continue;
                      } else if (curr[0].match(/\d/)) {
                          newSub.subNumber = Number(curr.slice(0, 2));
                          continue;
                      }
                  } 

                  if (newSub.subNumber === 0 && !newSub.subSize) {
                    // checks if this is a side item
                    let sideCheck = sideItemsCheck(currOrderItem.innerText.toLowerCase());
                    if (sideCheck) {
                        console.log(currOrderItem.innerText)
                        isSideItem = true;
                        newOrder.sideItems.push(currOrderItem.innerText);
                        break;
                    } else {
                      safetyCheck = false;
                      break;
                    }
                  }
                }
                if (isSideItem) {
                    if (!dontPush) {
                        orders.push(newOrder);
                    }
                    continue;
                }

                if (!safetyCheck) {
                    console.log("error")
                    newOrder.subError = true;
                    newOrder.raw = element.innerText;
                    continue;
                }

              } else {
              console.log("error")
              newOrder.subError = true;
              newOrder.raw = element.innerText;
              continue;
            }

            // sub toppings, size, and notes parsing

            let bodyText = currOrderItem.innerText.slice(textLength)

            if (!isSideItem) {
                if (!newSub.subSize) {
                    if (element.innerText.toLowerCase().includes("wrap")) {
                        newSub.subSize = "WR";
                    } else if (element.innerText.toLowerCase().includes("bowl") || element.innerText.toLowerCase().includes("tub")) {
                        newSub.subSize = "TUB"
                    } else {
                        newSub.subSize = "R";
                    }
                }
                bodyOfOrderParse(currOrderItem, bodyText, newOrder, newSub);
                if (!newSub.subBread) {
                    if (newSub.subSize === "TUB") {
                        newSub.subBread = "";
                    }
                    else newSub.subBread = "white";
                }
                newOrder.subs.push(newSub);
            }

        //   }

          if (!dontPush) {
              orders.push(newOrder);
          }
        }
        console.log(orders)
        setRawSubs(orders)
    }

    async function generatePDF() {
        const pdf = new jsPDF("p", "mm", "a4"); // Initialize jsPDF
        const pages = document.querySelectorAll('.page');
      
        for (let i = 0; i < pages.length; i++) {
          const canvas = await html2canvas(pages[i], {
            scale: 1, // Adjust scale as needed
            width: pages[i].offsetWidth,
            height: pages[i].offsetHeight,
          });
      
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate scaling factors
          const pdfPageWidth = 210;  // for A4 in mm
          const pdfPageHeight = 297;  // for A4 in mm
          const widthScale = pdfPageWidth / canvas.width;
          const heightScale = pdfPageHeight / canvas.height;
          const scale = Math.min(widthScale, heightScale);
      
          // Calculate image dimensions
          const imgWidth = canvas.width * scale;
          const imgHeight = canvas.height * scale;
      
          // Add image to PDF
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
          // Add new page only if it's not the last page
          if (i < pages.length - 1) {
            pdf.addPage();
          }
        }
        
        pdf.save("document.pdf"); // Save PDF
      }
      

  return (
    <div className="App">
        <div className='header'>
            <h1 className='header-txt'>LUNCHDROP LEGEND</h1>
        </div>
        <div className='main'>
            {rawSubs.length <= 0 ? <div className='paste'>
                <h2 className='paste-txt'>Paste Here</h2>
                <input className='paste-input'></input>
            </div>
            :
            <button className="print-btn" onClick={generatePDF}>PRINT</button>
            }
            <div className='vinnie-talk'>
                <h1 className='vinnie-talk-txt'>{vinnieTalk}</h1>
            </div>
            {/* {jumbled && animationState !== "complete" &&
                <div className='jumbled-text' style={vinnie.text}>
                    {jumbled.map(str => {
                        let rand = ((Math.random()*24) * 15);
                        let x = Math.random() * (1000 - 50);
                        let y = Math.random() * (50 - 10);
                        return <p style={{transform: `rotate(${rand}deg)`, left: `${x}px`, top: `${y}px`}} className='jumbled-item'>{str}</p>
                    })}
                </div>
            } */}
            {/* <img id="jm-bottle" style={vinnie.bottle} src={jmBottle} alt='you betcha'></img>
            <img id="jm-hat" style={vinnie.hat} src={jmHat} alt='you betcha'></img>
            <div className='vinegar' style={vinnie.vinegar}></div>
            {(animationState === "add eyes" || animationState === "complete")&& <img id="jm-eye-left" style={vinnie.eyes.left} src={eyes} alt='you betcha'></img>}
            {(animationState === "add eyes" || animationState === "complete")&& <img id="jm-eye-right" style={vinnie.eyes.right} src={eyes} alt='you betcha'></img>} */}
            {/* <FormattedSubs orders={rawSubs} subLegend={jmSubsLegend} animationState={animationState}/> */}
            <FormattedSubs orders={rawSubs} subLegend={jmSubsLegend} animationState={"complete"}/>

        </div>
    </div>
  );
}

export default App;
