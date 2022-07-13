import React, { Component } from 'react'
import { useState } from 'react'
import { forwardRef } from 'react'
import api from '../api'
import styled from 'styled-components'
import { NavBar } from '../components'
import DatePicker from 'react-datepicker'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const LilWrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 5px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`
const InputSelect = styled.select.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

const DatePick = ({parentCallback}) => {
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="btn btn-outline-secondary" onClick={onClick} ref={ref}>
        Pick a date
      </button>
    ),
  )
  return (
    <DatePicker
      selected={startDate}
      onChange={date => {
         setStartDate(date)
         parentCallback(date)}}
         customInput={<ExampleCustomInput />}
    />
  )
}

class ReservationsInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reservationNumber: '',
            name: '',
            lastName: '',
            phoneNo: '',
            roomSetting: '',
            date: '',
            time: '',
            options: null,
            allOptions: null,
        }
    }

    handleChangeInputReservationNumber = async event => {
        const reservationNumber = event.target.value
        this.setState({ reservationNumber })
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputLastName = async event => {
        const lastName = event.target.value
        this.setState({ lastName })
    }

    handleChangeInputPhoneNo = async event => {
        const phoneNo = event.target.value
        this.setState({ phoneNo })
    }

    handleChangeInputRoomSetting = async event => {
        const roomSetting = event.target.value
        this.setState({ roomSetting })
    }

    handleChangeInputDate = async event => {
        const {time} = this.state 
        const date = event.target.value
        this.getOptionsByDateTime(date, time);
        this.setState({ date })
    }

    handleChangeInputDatePicker = async (rawDate) => {
        const {time} = this.state 
        const str = rawDate.toString().split(" ", 4)
        const date = str[2] + " " + str[1].toUpperCase() + " " + str[3]
        this.getOptionsByDateTime(date, time);
        this.setState({ date })
    }

    handleChangeInputTime = async event => {
        const {date} = this.state 
        const time = event.target.value
        this.getOptionsByDateTime(date, time);
        this.setState({ time })
    }

    handleCreateReservation = async () => {
        const { reservationNumber, name, roomSetting, phoneNo, lastName } = this.state
        const roomSettingJSON = JSON.parse(roomSetting)
        const time = roomSettingJSON.time
        const date = roomSettingJSON.date
        const roomNumber = roomSettingJSON.roomNo
        const roomID = roomSettingJSON._id
        const instructor = roomSettingJSON.instructor
        const payload = { reservationNo: reservationNumber, 
            name: name, time: time, date: date, roomNo: roomNumber, phoneNo: phoneNo,
        lastName: lastName, roomID: roomID, instructor: instructor }

        await api.getPassByReservationId(reservationNumber).then(res => {
            if(!res.data.data.isActive){
               window.alert(`Pass is not active, please try a different pass`)
            } else {
               switch (res.data.data.passType) {
                  case 'class':
                     api.getSinglePass(res.data.data._id).then(res => {
                        if(!res.data.data.isUsed) {
                           api.updateSinglePassUsed(res.data.data.reservationID).then(() => {
                              this.makeReservation(payload, roomID)
                           }).catch(() => {
                              window.alert(`pass update failed`)
                           })
                        } else {
                           window.alert(`Single pass has been used`)
                        }
                     }).catch(() => {
                        const singlePassPayload = { reservationID: res.data.data._id, isUsed: true}
                        api.createSinglePass(singlePassPayload).then(res => {
                           this.makeReservation(payload, roomID)
                        })
                     })
                     break
                  case 'one':
                     api.getDayPass(res.data.data._id).then(res => {
                        if(res.data.data.dateBooked === date) {
                           this.makeReservation(payload, roomID)
                        } 
                        else if (res.data.data.dateBooked === " ") {
                           const dayPassPayload = { reservationID: res.data.data.reservationID, dateBooked: date}
                        api.updateDayPassDate(res.data.data.reservationID, dayPassPayload).then(res => {
                           this.makeReservation(payload, roomID)
                        })
                        }
                        else {
                           window.alert(`single day pass cannot be used on ` + date)
                        }
                     }).catch(() => {
                        const dayPassPayload = { reservationID: res.data.data._id, dateBooked: date}
                        api.createDayPass(dayPassPayload).then(res => {
                           this.makeReservation(payload, roomID)
                        })
                     })
                     break
                  case 'three':
                     api.getDayPass(res.data.data._id).then(res => {
                        this.makeReservation(payload, roomID)
                     }).catch(() => {
                        const dayPassPayload = { reservationID: res.data.data._id, dateBooked: date}
                        api.createDayPass(dayPassPayload).then(res => {
                           this.makeReservation(payload, roomID)
                        })
                     })
                     break
                  case 'two':
                     api.getDayPass(res.data.data._id).then(res => {
                        if (res.data.data.dateBooked === " ") {
                           const dayPassPayload = { reservationID: res.data.data.reservationID, dateBooked: date}
                        api.updateDayPassDate(res.data.data.reservationID, dayPassPayload).then(res => {
                           this.makeReservation(payload, roomID)
                        })
                        }
                        else {
                           this.makeReservation(payload, roomID)
                        }
                     }).catch(() => {
                        const dayPassPayload = { reservationID: res.data.data._id, dateBooked: date}
                        api.createDayPass(dayPassPayload).then(res => {
                           this.makeReservation(payload, roomID)
                        })
                     })
                     break
                  case 'vclass':
                     api.getSinglePass(res.data.data._id).then(res => {
                        if(!res.data.data.isUsed) {
                           api.updateSinglePassUsed(res.data.data.reservationID).then(() => {
                              this.makeVirtualReservation(payload, roomID)
                           }).catch(() => {
                              window.alert(`Pass update failed`)
                           })
                        } else {
                           window.alert(`Virtual single class pass has been used`)
                        }
                     }).catch(() => {
                        const singlePassPayload = { reservationID: res.data.data._id, isUsed: true}
                        api.createSinglePass(singlePassPayload).then(res => {
                           this.makeVirtualReservation(payload, roomID)
                        })
                     })
                     break
                  case 'vone':
                     api.getDayPass(res.data.data._id).then(res => {
                        if(res.data.data.dateBooked === date) {
                           this.makeVirtualReservation(payload, roomID)
                        } 
                        else if (res.data.data.dateBooked === " ") {
                           const dayPassPayload = { reservationID: res.data.data.reservationID, dateBooked: date}
                           api.updateDayPassDate(res.data.data.reservationID, dayPassPayload).then(res => {
                              this.makeVirtualReservation(payload, roomID)
                           })
                        }
                        else {
                           window.alert(`Virtual single day pass cannot be used on ` + date)
                        }
                     }).catch(() => {
                        const dayPassPayload = { reservationID: res.data.data._id, dateBooked: date}
                        api.createDayPass(dayPassPayload).then(res => {
                           this.makeVirtualReservation(payload, roomID)
                        })
                     })
                     break
               } 
            }
        }).catch(res => {
            window.alert(`Pass not exist, please try a different pass`)
        })
    }

    makeReservation = async (payload, roomID) => {
       api.createReservation(payload).then(() => {
           api.updateRoomByOne(roomID).then(() => {
              window.alert(`Reservation created successfully`) ? window.location.reload() : window.location.reload()
           })
       }).catch(res => {
           window.alert(`Reservation creation failed`)
       })
    }

    makeVirtualReservation = async (payload, roomID) => {
       api.createReservation(payload).then(() => {
           api.updateVirtualRoomByOne(roomID).then(() => {
              window.alert(`Reservation created successfully`) ? window.location.reload() : window.location.reload()
           })
       }).catch(res => {
           window.alert(`Reservation creation failed`)
       })
    }

    getOptions = async () => {
       await api.getRooms().then(res => {
          let allOptions = res.data.data.filter(data => (data.capacity < data.maxCapacity) || (data.virtualCapacity < data.maxVirtualCapacity))
          this.setState({allOptions: allOptions})
       })
    }

    getOptionsByDateTime = async (thisDate, thisTime) => {
       const {allOptions} = this.state
       let options = allOptions.filter(data => ((data.capacity < data.maxCapacity) || (data.virtualCapacity < data.maxVirtualCapacity)) && ((data.date === thisDate) && (data.time === thisTime)))
       this.setState({options: options})
    }

    componentDidMount = async () => {
      this.getOptions()
    }

    render() {
        const { reservationNumber, name, roomSetting, options, phoneNo, lastName, date, time } = this.state
        return (
            <Wrapper>
                <NavBar/>
                <Title>Reservation</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={reservationNumber}
                    onChange={this.handleChangeInputReservationNumber}
                />

                <Label>First Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Last Name: </Label>
                <InputText
                    type="text"
                    value={lastName}
                    onChange={this.handleChangeInputLastName}
                />

                <Label>Phone Number: </Label>
                <InputText
                    type="text"
                    value={phoneNo}
                    onChange={this.handleChangeInputPhoneNo}
                />
                
                <Label>Date: </Label>
                <LilWrapper>
                    <DatePick parentCallback={this.handleChangeInputDatePicker}/>
                </LilWrapper>
                <InputText
                    type="text"
                    value={date}
                    onChange={this.handleChangeInputDate}
                />

                <Label>Time: </Label>
                <InputSelect onChange={this.handleChangeInputTime} defaultvalue={time}>
                    <option hidden disabled selected value>-- Select a time --</option>
                    <option value="09:00 - 10:30">09:00 - 10:30</option>
                    <option value="11:00 - 12:30">11:00 - 12:30</option>
                    <option value="11:00 - 13:00">11:00 - 13:00</option>
                    <option value="14:00 - 15:30">14:00 - 15:30</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:30 - 17:30">16:30 - 17:30</option>
                    <option value="16:30 - 18:00">16:30 - 18:00</option>
                    <option value="16:30 - 18:30">16:30 - 18:30</option>
                </InputSelect>

                <Label>Available Classes: </Label>
                <InputSelect onChange={this.handleChangeInputRoomSetting} defaultvalue="">
                   <option hidden disabled selected value>-- Select an option --</option>
                   {this.state.options && this.state.options.map(object => {
                      return <option value={JSON.stringify(object)}>{
                      " Room: " + object.roomNo +
                      " ,Class Name: " + object.className +
                      " ,Instructor: " + object.instructor +
                      " ,Capacity: " + object.capacity + "/" + object.maxCapacity + 
                      " ,Virtual Capacity: " + object.virtualCapacity + "/" + object.maxVirtualCapacity}</option>
                   })}
                </InputSelect>
                <Button onClick={this.handleCreateReservation}>Book</Button>
                <CancelButton href={'/reservations/create'}>Clear</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationsInsert
