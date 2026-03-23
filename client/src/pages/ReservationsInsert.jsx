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

const Notice = styled.div`
    background: #fff3cd;
    border: 1px solid #ffe69c;
    border-radius: 8px;
    color: #664d03;
    margin: 10px 5px 20px 5px;
    padding: 12px 16px;
`

const DatePick = ({ parentCallback, disabled }) => {
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="btn btn-outline-secondary" onClick={onClick} ref={ref} disabled={disabled}>
        Pick a date
      </button>
    ),
  )
  return (
    <DatePicker
      selected={startDate}
      disabled={disabled}
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
        this.isSubmittingReservation = false

        this.state = {
            times: [],
            reservationNumber: '',
            name: '',
            lastName: '',
            phoneNo: '',
            roomSetting: '',
            date: '',
            time: '',
            options: null,
            allOptions: null,
            isLoading: false,
            allowReservations: true,
            isSettingsLoading: true,
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
        if (this.isSubmittingReservation) {
            return
        }

        if (!this.state.allowReservations) {
            window.alert('Reservations are currently disabled.')
            return
        }

        if(this.state.isLoading) return;

        this.isSubmittingReservation = true
        this.setState({ isLoading: true });
        try {
        const { reservationNumber, name, roomSetting, phoneNo, lastName } = this.state

        if (!roomSetting) {
           window.alert('Please select an available class.')
           return
        }

        const roomSettingJSON = JSON.parse(roomSetting)
        const time = roomSettingJSON.time
        const date = roomSettingJSON.date
        const roomNumber = roomSettingJSON.roomNo
        const roomID = roomSettingJSON._id
        const instructor = roomSettingJSON.instructor
        const payload = { reservationNo: reservationNumber, 
            name: name, time: time, date: date, roomNo: roomNumber, phoneNo: phoneNo,
        lastName: lastName, roomID: roomID, instructor: instructor }

        const reservationCreated = await this.makeReservation(payload)

        if (!reservationCreated) {
            return
        }
      } catch (error) {
         console.error(error);
      } finally {
         this.setState({ isLoading: false });
         this.isSubmittingReservation = false
      }
    }

    makeReservation = async (payload) => {
       try {
           await api.createReservation(payload)
           window.alert(`Reservation created successfully`)
           window.location.reload()
           return true
       } catch (error) {
           window.alert(`Reservation creation failed ` + (error.response?.data?.message || error.message || ''))
           return false
       }
    }

    getOptions = async () => {
    try {
         const [roomRes, timeRes, settingsRes] = await Promise.allSettled([
               api.getRooms(),
               api.getTimes(),
               api.getAppSettings(),
         ])

         // rooms
         if (roomRes.status === 'fulfilled' && roomRes.value?.data?.success) {
               const allOptions = roomRes.value.data.data.filter(room =>
                  room.capacity < room.maxCapacity ||
                  room.virtualCapacity < room.maxVirtualCapacity
               )

               this.setState({ allOptions })
         } else {
               this.setState({ allOptions: [] })
         }

         // times
         if (timeRes.status === 'fulfilled' && timeRes.value?.data?.success) {
               this.setState({ times: timeRes.value.data.data })
         } else {
               this.setState({ times: [] })
         }

         if (settingsRes.status === 'fulfilled' && settingsRes.value?.data?.success) {
               this.setState({
                  allowReservations: settingsRes.value.data.data.allowReservations,
                  isSettingsLoading: false,
               })
         } else {
               this.setState({ isSettingsLoading: false })
         }
      } catch (err) {
         console.error('Failed to load rooms or times', err)
         this.setState({ isSettingsLoading: false })
      }
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
        const { reservationNumber, name, roomSetting, options, phoneNo, lastName, date, time, allowReservations, isSettingsLoading, isLoading } = this.state
        const isFormDisabled = !allowReservations || isSettingsLoading || isLoading
        return (
            <Wrapper>
                <NavBar/>
                <Title>Reservation</Title>

                {!isSettingsLoading && !allowReservations && (
                    <Notice>
                        Reservations are temporarily disabled. Please contact the studio for updates.
                    </Notice>
                )}

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={reservationNumber}
                    onChange={this.handleChangeInputReservationNumber}
                    disabled={isFormDisabled}
                />

                <Label>First Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                    disabled={isFormDisabled}
                />

                <Label>Last Name: </Label>
                <InputText
                    type="text"
                    value={lastName}
                    onChange={this.handleChangeInputLastName}
                    disabled={isFormDisabled}
                />

                <Label>Phone Number: </Label>
                <InputText
                    type="text"
                    value={phoneNo}
                    onChange={this.handleChangeInputPhoneNo}
                    disabled={isFormDisabled}
                />
                
                <Label>Date: </Label>
                <LilWrapper>
                    <DatePick parentCallback={this.handleChangeInputDatePicker} disabled={isFormDisabled} />
                </LilWrapper>
                <InputText
                    type="text"
                    value={date}
                    onChange={this.handleChangeInputDate}
                    disabled={isFormDisabled}
                />

                <Label>Time: </Label>
                <InputSelect
                    value={time}
                    onChange={this.handleChangeInputTime}
                    disabled={isFormDisabled}
                >
                    <option value="" disabled>
                        -- Select a time --
                    </option>

                    {this.state.times.map(t => (
                        <option key={t._id} value={t.time}>
                            {t.time}
                        </option>
                    ))}
                </InputSelect>

                <Label>Available Classes: </Label>
                <InputSelect
                   onChange={this.handleChangeInputRoomSetting}
                   value={roomSetting}
                   disabled={isFormDisabled}
                >
                   <option hidden disabled selected value>-- Select an option --</option>
                   {this.state.options && this.state.options.map(object => {
                      return <option key={object._id} value={JSON.stringify(object)}>{
                      " Room: " + object.roomNo +
                      " ,Class Name: " + object.className +
                      " ,Instructor: " + object.instructor +
                      " ,Capacity: " + object.capacity + "/" + object.maxCapacity + 
                      " ,Virtual Capacity: " + object.virtualCapacity + "/" + object.maxVirtualCapacity}</option>
                   })}
                </InputSelect>
                <Button onClick={this.handleCreateReservation} disabled={isFormDisabled}>
                    {isLoading ? 'Booking...' : 'Book'}
                </Button>
                <CancelButton href={'/reservations/create'}>Clear</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationsInsert
