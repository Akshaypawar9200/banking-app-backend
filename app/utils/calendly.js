const { default: axios } = require('axios');
const { BadRequest } = require('throw.js')
const authToken = process.env.CALENDLY_TOKEN;
class Calendly {

  async get(scheduledEventUrl) {

    const headers = {
      authorization: `Bearer ${authToken}`
    }
    try {
      let eventGuest = []
      const response = await axios.get(scheduledEventUrl, { headers });
      const data = response.data.resource;
      let startDate = new Date(data.start_time)
      let current = new Date()
      if (data?.cancellation) {
        throw new BadRequest("the event url you're trying to access has been cancelled")
      } else if (startDate < current) {
        throw new BadRequest("event has already been completed")

      }
      const duration = this.getMinutesDifference(data.start_time, data.end_time)

      for (let i = 0; i < data.event_guests.length; i++) {
        eventGuest.push(data.event_guests[i].email)
      }

      const response2 = await axios.get(scheduledEventUrl + "/invitees", { headers });
      const data2 = response2.data.collection;
      if (data2[0]?.email) {
        eventGuest.push(data2[0]?.email)
      }

      let userAppointment = {
        calendlyEventUrl: scheduledEventUrl,
        description: "",
        attendeeEmails: eventGuest,
        appointmentDate: startDate,
        duration: duration
      }

      return userAppointment
    } catch (error) {
      if (error.data) {
        throw new BadRequest(error.data)
      }
      throw new BadRequest(error.message)
    }
  }

  async cancelEvent(scheduledEventUrl) {
    const headers = {
      authorization: `Bearer ${authToken}`
    }
    await axios.post(scheduledEventUrl + "/cancellation", { reason: "Something went wrong while creating sam filter." }, { headers });
  }

  getMinutesDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMilliseconds = end - start;

    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    return diffInMinutes;
  }
}
module.exports = Calendly;