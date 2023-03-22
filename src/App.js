import logo from './logo.svg';
import './App.css';
import {useState} from "react"
import FormattedSubs from './FormattedSubs';

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
            55: [["onion", "- grl o's"], ["green pepper", "- grl peps"], ["sweet pepper", "-grl peps"], ["jalapeno", "- jal peps"], ["mushroom", "- mush"]],
            56: [["onion", "- grl o's"], ["green pepper", "- grl peps"], ["sweet pepper", "-grl peps"], ["jalapeno", "- jal peps"], ["mushroom", "- mush"]],
            64: [["onion", "- grl o's"], ["pepper", "- green peps"]],
            65: [["onion", "- grl o's"], ["pepper", "- grl peps"], ["mushroom", "- port"], ["port", "- port"]],
            66: [["onion", "- grl o's"], ["pepper", "- grl peps"], ["mushroom", "- port"], ["port", "- port"]],
        },
        mikesWay: ["onion", "lettuce", "tomato", "vinegar", "oil", "oregano", "salt"],
        extras: ["chipot", "chipol", "mayo", "pickle", "banana pepper", "jalapeno pepper", "jalapenos", "cherry pepper relish", "brown mustard", "yellow mustard", "spicy mustard", "honey mustard", "mustard"],
        cheese: ["provolone", "swiss", "american", "cheese"],
        breadtype: ["white", "wheat", "rosemary", "parmesan", "spinach", "gluten"]
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

    document.addEventListener('paste', (e) => {
        e.preventDefault();
        let pasted = e.clipboardData.getData("text/html");
        logFormattedText(pasted)
    })

    const coldSubSubtractionParse = (currChange, customerSub, mw, currSubNumber) => {
        let changeFound = false;

        // checking mikes way
        for (let j = 0; j < mw.length; j++) {
            console.log(mw[j], currChange)
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
            for (let j = 0; j < jmSubsLegend.cheese; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    if (currSubNumber != 1 || currSubNumber != 10) {
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
            for (let j = 0; j < jmSubsLegend.cheese; j++) {
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
            for (let j = 0; j < jmSubsLegend.cheese; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    customerSub.additions.push("extra cheese");
                    changeFound = true;
                    break;
                }
            }
        }

        // checking bacon
        if (!changeFound) {
            if (currChange.includes("bacon")) {
                customerSub.additions.push("bacon");
                changeFound = true;
            }
        }

        // checking extra meat
        if (!changeFound) {
            if (currChange.includes("meat")) {
                customerSub.additions.push("extra meat");
                changeFound = true;
            }
        }

        // cleanup -- occurs when a misspelled, unknown or uncommon subtraction is supplied
        // this text will be moved to the notes section and left for crewmate to decipher.
        if (!changeFound) {
            console.log(currChange)
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
            for (let j = 0; j < jmSubsLegend.cheese; j++) {
                if (currChange.includes(jmSubsLegend.cheese[j])) {
                    customerSub.additions.push("extra cheese");
                    changeFound = true;
                    break;
                }
            }
        }

        // checking bacon
        if (!changeFound) {
            if (currChange.includes("bacon")) {
                customerSub.additions.push("bacon");
                changeFound = true;
            }
        }

        // checking extra meat
        if (!changeFound) {
            if (currChange.includes("meat")) {
                customerSub.additions.push("extra meat");
                changeFound = true;
            }
        }

        // checking portabello 
        if (!changeFound) {
            if (currChange.includes("port")) {
                customerSub.additions.push("port");
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
            if (currChange.includes("no") && !currChange.match(/\d/)) {
                if (customerSub.isColdSub) {
                    coldSubSubtractionParse(currChange, customerSub, mw, currSubNumber);
                } else {
                    hotSubSubtractionParse(currChange, customerSub, currSubNumber)
                }
            } else if (currChange.includes("add")) {
                if (customerSub.isColdSub) {
                    coldSubAdditionParse(currChange, customerSub, mw, xtra, currSubNumber, customerOrder);
                } else {
                    hotSubAdditionParse(currChange, customerSub, currSubNumber, xtra, customerOrder)
                }
            } 

            // breadtype and cleanup
            else {
                let changeFound = false;
                for (let j = 0; j < jmSubsLegend.breadtype.length; j++) {
                    if (currChange.includes(jmSubsLegend.breadtype[j])) {
                        customerSub.subBread = jmSubsLegend.breadtype[j];
                        changeFound = true;
                        break;
                    }
                }
                
                // this is the last line of defense. If a match hasnt been determined yet it is likely a side item stuck in the toppings section 
                // or no keywords { NO ADD ON } were matched. In this instance 
                if (!changeFound) {
                    if (currChange.match(/\d/)) {
                        customerOrder.sideItems.push(currChange);
                    } else {
                        customerSub.notes += "\n Lunchdrop Legend could not classify the following: " + currChange;
                    }
                }
            }
        }
    }

    function logFormattedText(pastedText) {
        console.log("called twice")
        const orders = [];
        let htmlElement = document.createElement('div');
        htmlElement.id = "mydiv"
        htmlElement.innerHTML = pastedText;
        
        let formattedElements = htmlElement.querySelectorAll('#mydiv > ul > li');
      
        for (let i = 0; i < formattedElements.length; i++) {
          let element = formattedElements[i];
          let currId = `order${i+1}`;
          element.id = currId;
        //   console.log(element.innerHTML)
          
          let newOrder = {
            orderName: "",
            subs: [],
            sideItems: [],
          };
          console.log(newOrder)
          let subError = false;

          // Order Name
          if (element.querySelector("strong")) {
            newOrder.orderName = element.querySelector("strong").innerText;
          } else {
            console.log("error")
            newOrder.subError = true;
            newOrder.raw = element.innerText;
            continue;
          }

          // loop to see if there are multiple subs and or side items 

          let orderItems = element.querySelectorAll(`#${currId} > ul > li`);
          
          for (let j = 0; j < orderItems.length; j++) {
            let currOrderItem = orderItems[j];
            let textLength = 0;
            let isSideItem = false;
            console.log(currOrderItem.innerText, currOrderItem)
            let newSub = {
                subNumber: 0,
                subSize: "",
                subBread: "",
                isColdSub: true,
                subtractions: [],
                additions: [],
                notes: "",
            };
            

            // Sub Number, Size
  
            if (currOrderItem.querySelectorAll("span")[0]) {
              let safetyCheck = true;
              let breadStats = currOrderItem.querySelectorAll("span")[0].innerText.toLowerCase();
              textLength = breadStats.length;
              breadStats = breadStats.split(" ");
  
              for (let k = 0; k < breadStats.length; k++) {
                  let curr = breadStats[k];
  
                  if (newSub.subSize && newSub.subNumber !== 0) {
                      break;
                  }
  
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
                      } else if (element.innerText.toLowerCase().includes("wrap")) {
                          newSub.subSize = "WR";
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
                          newSub.subNumber = curr.slice(1);
                          continue;
                      } else if (curr[0].match(/\d/)) {
                          newSub.subNumber = curr.slice(0, 2);
                          continue;
                      }
                  } 

                  if (newSub.subNumber === 0 && !newSub.subSize) {
                    // checks if this is a side item
                    let sideCheck = sideItemsCheck(currOrderItem.innerText.toLowerCase());
                    if (sideCheck) {
                      newOrder.sideItems.push(currOrderItem.innerText);
                      isSideItem = true;
                      break;
                    } else {
                      safetyCheck = false;
                      break;
                    }
                  }
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
                bodyOfOrderParse(currOrderItem, bodyText, newOrder, newSub);
                newOrder.subs.push(newSub);
            }

          }

          orders.push(newOrder);
        }
        orders.forEach(order => {
            console.log(order.orderName)
            console.log(order.subs)
            console.log(order.sideItems)
        })
        setRawSubs(orders)
    }

  return (
    <div className="App">
        <input></input>
        <FormattedSubs orders={rawSubs} subLegend={jmSubsLegend} />
    </div>
  );
}

export default App;
