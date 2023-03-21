import logo from './logo.svg';
import './App.css';
import {useState} from "react"

function App() {

    const jmSubsLegend = {
        hotSubs: [16, 17, 19, 26, 31, 42, 43, 44, 55, 56, 64, 65, 66],
        mikesWay: ["onions, lettuce, tomatoes, vinegar, oil, oregano, salt"],
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
            console.log(currOrderItem.innerText)
            let newSub = {
                subNumber: 0,
                subSize: "",
                subBread: "",
                isColdSub: true,
                toppings: [],
                notes: "",
            };
            

            // Sub Number, Size
  
            if (currOrderItem.querySelectorAll("span")[0]) {
              let isSideItem = false;
              let safetyCheck = true;
              let breadStats = currOrderItem.querySelectorAll("span")[0].innerText.toLowerCase();
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
                } else if (!isSideItem){
                  newOrder.subs.push(newSub);
                }

              } else {
              console.log("error")
              newOrder.subError = true;
              newOrder.raw = element.innerText;
              continue;
            }

            
  
            // Notes 
  
            // if (element.querySelector("em")) {
            //   newOrder.notes = element.querySelector("em").innerText;
            //   console.log(newOrder)
            // } 

          }
          orders.push(newOrder);
        }
        console.log(orders)
      }

  return (
    <div className="App">
        <input></input>
    </div>
  );
}

export default App;
