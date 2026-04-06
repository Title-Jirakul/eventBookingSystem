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

const StatusCard = styled.div`
    border-radius: 8px;
    margin: 10px 5px 20px 5px;
    padding: 12px 16px;
`

const ProcessingCard = styled(StatusCard)`
    background: #e7f1ff;
    border: 1px solid #b6d4fe;
    color: #084298;
`

const ErrorCard = styled(StatusCard)`
    background: #f8d7da;
    border: 1px solid #f1aeb5;
    color: #842029;
`

const SuccessCard = styled(StatusCard)`
    background: #d1e7dd;
    border: 1px solid #a3cfbb;
    color: #0f5132;
`

const ActionsRow = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
        this.selectedRoomId = ''

        this.state = {
            times: [],
            reservationNumber: '',
            name: '',
            lastName: '',
            phoneNo: '',
            roomSettingId: '',
            date: '',
            time: '',
            options: null,
            allOptions: null,
            isLoading: false,
            allowReservations: true,
            isSettingsLoading: true,
            submitError: '',
            submitSuccess: '',
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
        const roomSettingId = event.target.value
        this.selectedRoomId = roomSettingId
        this.setState({ roomSettingId })
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
            this.setState({ submitError: 'Reservations are currently disabled.', submitSuccess: '' })
            return
        }

        if(this.state.isLoading) return;

        this.isSubmittingReservation = true
        this.setState({ isLoading: true, submitError: '', submitSuccess: '' });
        try {
        const { reservationNumber, name, phoneNo, lastName, options, roomSettingId } = this.state
        const selectedRoomId = this.selectedRoomId || roomSettingId
        const selectedRoom = (options || []).find((option) => option._id === selectedRoomId)

        if (!selectedRoom) {
           this.setState({ submitError: 'Please select an available class.' })
           return
        }

        const time = selectedRoom.time
        const date = selectedRoom.date
        const roomNumber = selectedRoom.roomNo
        const roomID = selectedRoom._id
        const instructor = selectedRoom.instructor
        const payload = { reservationNo: reservationNumber, 
            name: name, time: time, date: date, roomNo: roomNumber, phoneNo: phoneNo,
        lastName: lastName, roomID: roomID, instructor: instructor }

        const reservationCreated = await this.makeReservation(payload)

        if (!reservationCreated) {
            return
        }
      } catch (error) {
         console.error(error);
         this.setState({ submitError: 'Something went wrong while creating the reservation.' })
      } finally {
         this.setState({ isLoading: false });
         this.isSubmittingReservation = false
      }
    }

    makeReservation = async (payload) => {
       try {
           await api.createReservation(payload)
           this.setState({ submitSuccess: 'Reservation created successfully.', submitError: '' })
           window.setTimeout(() => {
              window.location.reload()
           }, 700)
           return true
       } catch (error) {
           this.setState({
              submitError: `Reservation creation failed ${error.response?.data?.message || error.message || ''}`.trim(),
              submitSuccess: '',
           })
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
       const options = allOptions.filter(data => ((data.capacity < data.maxCapacity) || (data.virtualCapacity < data.maxVirtualCapacity)) && ((data.date === thisDate) && (data.time === thisTime)))
       const selectedOptionStillExists = options.some((option) => option._id === this.selectedRoomId)

       if (!selectedOptionStillExists) {
            this.selectedRoomId = ''
       }

       this.setState({
            options,
            roomSettingId: selectedOptionStillExists ? this.state.roomSettingId : '',
       })
    }

    componentDidMount = async () => {
      this.getOptions()
    }

    render() {
        const {
            reservationNumber,
            name,
            roomSettingId,
            options,
            phoneNo,
            lastName,
            date,
            time,
            allowReservations,
            isSettingsLoading,
            isLoading,
            submitError,
            submitSuccess,
        } = this.state
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

                {isLoading && (
                    <ProcessingCard>
                        Please wait while we validate your pass, reserve your class, and confirm the booking.
                    </ProcessingCard>
                )}

                {!isLoading && submitError && (
                    <ErrorCard>{submitError}</ErrorCard>
                )}

                {!isLoading && submitSuccess && (
                    <SuccessCard>{submitSuccess}</SuccessCard>
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
                   value={roomSettingId}
                   disabled={isFormDisabled}
                >
                   <option value="" disabled>-- Select an option --</option>
                   {this.state.options && this.state.options.map(object => {
                      return <option key={object._id} value={object._id}>{
                      " Room: " + object.roomNo +
                      " ,Class Name: " + object.className +
                      " ,Instructor: " + object.instructor +
                      " ,Capacity: " + object.capacity + "/" + object.maxCapacity + 
                      " ,Virtual Capacity: " + object.virtualCapacity + "/" + object.maxVirtualCapacity}</option>
                   })}
                </InputSelect>
                <ActionsRow>
                    <Button onClick={this.handleCreateReservation} disabled={isFormDisabled}>
                        {isLoading && (
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                        )}
                        {isLoading ? 'Booking...' : 'Book'}
                    </Button>
                    <CancelButton href={'/reservations/create'}>Clear</CancelButton>
                </ActionsRow>
            </Wrapper>
        )
    }
}

export default ReservationsInsert
