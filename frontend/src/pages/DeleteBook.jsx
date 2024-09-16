import React from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import axios from 'axios'

export default function DeleteBook() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()
    const handleDeleteBook = () => {
        setLoading(true)
        axios.delete(`http://localhost:5555/books/${id}`)
            .then(() => {
                setLoading(false)
                navigate('/')
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
                alert('Failed to delete book')
            })
    }
    return (
        <div className='p-4'>
            <BackButton />
            <h1 className='text-3xl my-4'>Delete Book</h1>
            {loading ? <Spinner /> : ''}
            <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
                <h3 className='text-2xl'>Jste si jistý že chcete odstranit tuto knihu?</h3>
                <button className='p-4 bg-red-600 textwhite m-8 w-full'
                    onClick={handleDeleteBook}>Odstranit
                </button>
            </div>
        </div>
    )
}
