
export async function load() {
  const response  = await fetchCalendarEvents("2024-09-16");

  const unparsedEDT = await response.text(); // Get the response as text

  return {
    unparsedEDT
  }
}

function fetchCalendarEvents(weekStartDate: string) {
  const jidt = "j_idt119"
  // Convert the start of the week to a Unix timestamp (in milliseconds)
  const startDate = new Date(weekStartDate).getTime();

  // Add 6 days to get the end of the week
  const endDate = new Date(startDate + 6 * 24 * 60 * 60 * 1000).getTime();

  // Format the date for form:date_input (dd/MM/yyyy)
  const formattedDate = new Intl.DateTimeFormat('fr-FR').format(new Date(startDate));

  // Get the week number (ISO Week)
  const weekNumber = getWeekNumber(new Date(startDate));

  console.log(startDate, endDate ,formattedDate, weekNumber)
  const temoin = "javax.faces.partial.ajax=true&javax.faces.source=form%3Aj_idt119&javax.faces.partial.execute=form%3Aj_idt119&javax.faces.partial.render=form%3Aj_idt119&form%3Aj_idt119=form%3Aj_idt119&form%3Aj_idt119_start=1725228000000&form%3Aj_idt119_end=1725746400000&form=form&form%3AlargeurDivCenter=&form%3AidInit=webscolaapp.Planning_364238723742996202&form%3Adate_input=02%2F09%2F2024&form%3Aweek=36-2024&form%3Aj_idt119_view=agendaWeek&form%3AoffsetFuseauNavigateur=-7200000&form%3Aonglets_activeIndex=0&form%3Aonglets_scrollState=0&form%3Aj_idt245_focus=&form%3Aj_idt245_input=44323&javax.faces.ViewState=7495890746698720676%3A1112376055249351560"
  const body = `javax.faces.partial.ajax=true&javax.faces.source=form%3A${jidt}&javax.faces.partial.execute=form%3A${jidt}&javax.faces.partial.render=form%3A${jidt}&form%3A${jidt}=form%3A${jidt}&form%3A${jidt}_start=${startDate}&form%3A${jidt}_end=${endDate}&form%3Adate_input=${formattedDate}&form%3Aweek=${weekNumber}&form%3A${jidt}_view=agendaWeek&form%3AoffsetFuseauNavigateur=-7200000&javax.faces.ViewState=-1616752800171313021%3A-20613947683233818`;
  console.log(body);
  // Generate the POST request
  return fetch("https://lise.ensam.eu/faces/Planning.xhtml", {
    headers: {
      accept: "application/xml, text/xml, */*; q=0.01",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "faces-request": "partial/ajax",
      priority: "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      "cookie":"JSESSIONID=9DC80DBBC473CCC9EA88761025200E9D"
    },
    referrer: "https://lise.ensam.eu/faces/Planning.xhtml",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: temoin,
    method: "POST",
    mode: "cors",
    credentials: "include"
  });
}


function getWeekNumber(date: Date): string {
  // Copy date to avoid modifying the original
  const currentDate = new Date(date.getTime());

  // Set the time to midnight to avoid time-related issues
  currentDate.setHours(0, 0, 0, 0);

  // Get the current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = currentDate.getDay();

  // Make Sunday (0) the 7th day of the week for ISO
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  // Adjust the date to the nearest Thursday (ISO week starts on Monday)
  currentDate.setDate(currentDate.getDate() + (4 - adjustedDay));

  // Get the first day of the year
  const yearStart = new Date(currentDate.getFullYear(), 0, 1);

  // Calculate the number of days between the adjusted date and the first day of the year
  const diff = currentDate.getTime() - yearStart.getTime();

  // Get the ISO week number by dividing the difference by the number of milliseconds in a day, and then in a week
  const oneDayInMs = 86400000;
  const weekNumber = Math.ceil((diff / oneDayInMs + 1) / 7);

  // Return the week number and the year in ISO format
  return `${weekNumber}-${currentDate.getFullYear()}`;
}


