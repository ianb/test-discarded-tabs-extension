const TEST_URL = "https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/executeScript";
const TEST_SCRIPT = `JSON.stringify({body: document.body, time: Date.now()})`;

browser.browserAction.onClicked.addListener(async () => {
  try {
    let tab = await browser.tabs.create({
      url: TEST_URL,
      active: false
    });
    let tabId = tab.id;
    let result = await browser.tabs.executeScript(tabId, {
      code: TEST_SCRIPT
    });
    console.log("Got result from awake tab:", result, "tabId:", tabId);
    await browser.tabs.discard(tabId);
    console.log("Have now discarded tab, sending new message");
    setTimeout(async () => {
      let tab = await browser.tabs.get(tabId);
      console.log("After 3 seconds, discarded state of tab is:", tab.discarded);
    }, 3000);
    let discardResult = await browser.tabs.executeScript(tabId, {
      code: TEST_SCRIPT
    });
    console.log("Executed on discarded tab:", discardResult);
  } catch (e) {
    console.log("Error in test script:", e)
  }
});
