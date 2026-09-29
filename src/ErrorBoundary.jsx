import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Todo app failed to render:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app" role="alert">
          <h1>Something went wrong</h1>
          <p>The todo list could not be displayed. Refresh the page to try again.</p>
        </div>
      )
    }

    return this.props.children
  }
}
