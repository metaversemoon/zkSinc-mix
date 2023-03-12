import React from 'react'
import Image from 'next/image'
import FeaturesImg from '../public/img/feature1.png'
import FeaturesTwo from '../public/img/feature2.png'
import FeaturesThree from '../public/img/final.png'

const Features = () => {
  return (
    <section className="pb-6" style={{ backgroundColor: '#212548' }}>
      <h1 className="pt-5 pb-4 text-4xl text-white text-center md:text-5xl">
        Explore
      </h1>
      <div className="flex items-center justify-center py-14">
        <Image
          src={FeaturesImg}
          alt="Explore Feature Image"
          style={{ width: '90%' }}
        />
      </div>
      <h1 className="pt-5 pb-4 text-4xl text-white text-center md:text-5xl">
        Deploy
      </h1>
      <div className="flex items-center justify-center py-14">
        <Image
          src={FeaturesTwo}
          alt="Deploy Feature Image"
          style={{ width: '90%' }}
        />
      </div>
      <h1 className="pt-5 pb-4 text-4xl text-white text-center md:text-5xl">
        Verify
      </h1>
      <div className=" flex items-center justify-center py-14">
        <Image
          src={FeaturesThree}
          alt="Verify Feature Image"
          style={{ width: '90%' }}
        />
      </div>
    </section>
  )
}

export default Features
