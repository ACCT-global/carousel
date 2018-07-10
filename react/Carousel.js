import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Slider } from 'vtex.store-components'
import Banner from './Banner'
import { NoSSR } from 'render'

import './global.css'

const GLOBAL_PAGES = global.__RUNTIME__ && Object.keys(global.__RUNTIME__.pages)

const defaultBannerProps = index => ({
  image: `https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-0${index + 1}.png`,
  page: 'store/home',
  description: 'banner',
})

/**
 * Carousel component. Shows a serie of banners.
 */
export default class Carousel extends Component {
  static defaultProps = {
    autoplay: true,
    showArrows: true,
    showDots: true,
    height: 420,
    mobileHeight: 339,
    autoplaySpeed: 5,
    banners: [],
  }

  static uiSchema = {
    banners: {
      items: {
        image: {
          'ui:widget': 'image-uploader',
        },
        typeOfRoute: {
          'ui:widget': 'radio',
          'ui:options': {
            'inline': true,
          },
        },
      },
    },
  }

  static propTypes = {
    /** Should change images automatically */
    autoplay: PropTypes.bool.isRequired,
    /** How long it should wait to change the banner in secs */
    autoplaySpeed: PropTypes.number.isRequired,
    /** Max height size of the banners */
    height: PropTypes.number.isRequired,
    /** Max height size of the banners on mobile */
    mobileHeight: PropTypes.number.isRequired,
    /** Set visibility of dots */
    showDots: PropTypes.bool,
    /** Set visibility of arrows */
    showArrows: PropTypes.bool,
    /** Banners that will be displayed by the Carousel
     *    image - The image url of the banner
     *    page - The page that the banner will be linking to
     *    description - The description of the image
     */
    banners: PropTypes.arrayOf(PropTypes.shape({
      image: PropTypes.string,
      description: PropTypes.string,
      typeOfRoute: PropTypes.string,
      page: PropTypes.string,
      params: PropTypes.string,
    })),
  }

  static getSchema = props => {
    const autoplay = props.autoplay || false

    return {
      title: 'editor.carousel.title',
      description: 'editor.carousel.description',
      type: 'object',
      properties: {
        showDots: {
          type: 'boolean',
          title: 'editor.carousel.showDots.title',
          default: true,
          isLayout: true,
        },
        showArrows: {
          type: 'boolean',
          title: 'editor.carousel.showArrows.title',
          default: true,
          isLayout: true,
        },
        height: {
          type: 'number',
          title: 'editor.carousel.height.title',
          default: 420,
          enum: [420, 440],
          isLayout: true,
        },
        mobileHeight: {
          type: 'number',
          title: 'editor.carousel.mobileHeight.title',
          default: 339,
          enum: [339, 159],
          isLayout: true,
        },
        autoplay: {
          type: 'boolean',
          title: 'editor.carousel.autoplay.title',
          default: true,
          isLayout: true,
        },
        autoplaySpeed: autoplay ? {
          type: 'number',
          title: 'editor.carousel.autoplaySpeed.title',
          default: 5,
          enum: [4, 5, 6],
          widget: {
            'ui:widget': 'radio',
            'ui:options': {
              'inline': true,
            },
          },
          isLayout: true,
        } : {},
        banners: {
          type: 'array',
          title: 'Banners',
          minItems: 1,
          items: {
            type: 'object',
            title: 'Banner',
            properties: {
              image: {
                type: 'string',
                title: 'editor.carousel.banner.image.title',
                default: '',
                widget: {
                  'ui:widget': 'image-uploader',
                },
              },
              description: {
                type: 'string',
                title: 'editor.carousel.banner.description.title',
                default: '',
              },
              typeOfRoute: {
                type: 'string',
                title: 'editor.carousel.banner.typeOfRoute.title',
                default: 'internal',
                enum: ['internal', 'external'],
                enumNames: [
                  'editor.carousel.banner.typeOfRoute.internal',
                  'editor.carousel.banner.typeOfRoute.external',
                ],
                widget: {
                  'ui:widget': 'radio',
                  'ui:options': {
                    'inline': true,
                  },
                },
              },
              page: {
                type: 'string',
                enum: GLOBAL_PAGES,
                title: 'editor.carousel.bannerLink.page.title',
                isLayout: false,
              },
              params: {
                type: 'string',
                description: 'editor.carousel.bannerLink.params.description',
                title: 'editor.carousel.bannerLink.params.title',
                isLayout: false,
              },
            },
          },
        },
      },
    }
  }

  configureSettings() {
    const { autoplay, autoplaySpeed, showDots, showArrows } = this.props

    return {
      speed: 500,
      infinite: true,
      pauseOnHover: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      autoplaySpeed: autoplaySpeed * 1000,
      dots: showDots,
      arrows: showArrows,
      autoplay,
    }
  }

  render() {
    const {
      height,
      banners,
      mobileHeight,
    } = this.props
    const settings = this.configureSettings()

    const banner = defaultBannerProps(0)
    const fallback = (
      <div style={{ maxHeight: `${height}px` }} className="overflow-y-hidden">
        <Banner
          height={height}
          image={banner.image}
          description={banner.description}
          mobileHeight={mobileHeight}
          page={banner.page}
          params={banner.params}
          typeOfRoute={banner.typeOfRoute}
        />
      </div>
    )
    return (
      <div className="vtex-carousel">
        <NoSSR onSSR={fallback}>
          <Slider sliderSettings={settings} >
            {banners.map((banner, i) => banner && banner.image && (
              <div key={i} style={{ maxHeight: `${height}px` }}>
                <Banner
                  height={height}
                  image={banner.image}
                  description={banner.description}
                  mobileHeight={mobileHeight}
                  page={banner.page}
                  params={banner.params}
                  typeOfRoute={banner.typeOfRoute}
                />
              </div>
            ))}
          </Slider>
        </NoSSR>
      </div>
    )
  }
}
