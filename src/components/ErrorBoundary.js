import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: error };
	}

	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, info);
	}

	render() {
		const error = this.state.hasError;
		if (error) {
			// You can render any custom fallback UI
			if (process.env.NODE_ENV === "development") {
				return (
					<>
						<h2>{this.props.message || "ErrorBoundary caught error"}</h2>
						<pre>{error.toString()}</pre>
						<pre>{error.stack}</pre>
					</>
				);
			}
			return <h2>Error</h2>;
		}
		return this.props.children;
	}
}
export default ErrorBoundary;
