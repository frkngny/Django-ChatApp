import React from 'react'

function HomePage() {
    return (
        <div>
            <>
                <main role="madin" style={{ marginTop: 50 }}>
                    {/* Main jumbotron for a primary marketing message or call to action */}
                    <div className="jumbotron">
                        <div className="container">
                            <h1 className="display-3">Hello, world!</h1>
                            <p>
                                This is a template for a simple marketing or informational website. It
                                includes a large callout called a jumbotron and three supporting
                                pieces of content. Use it as a starting point to create something more
                                unique.
                            </p>
                            <p>
                                <a className="btn btn-primary btn-lg" href="#" role="button">
                                    Learn more »
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="container">
                        {/* Example row of columns */}
                        <div className="row">
                            <div className="col-md-4">
                                <h2>Heading</h2>
                                <p>
                                    :)
                                </p>
                                <p>
                                    <a className="btn btn-secondary" href="#" role="button">
                                        View details »
                                    </a>
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h2>Heading</h2>
                                <p>
                                    :)
                                </p>
                                <p>
                                    <a className="btn btn-secondary" href="#" role="button">
                                        View details »
                                    </a>
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h2>Heading</h2>
                                <p>
                                    :)
                                </p>
                                <p>
                                    <a className="btn btn-secondary" href="#" role="button">
                                        View details »
                                    </a>
                                </p>
                            </div>
                        </div>
                        <hr />
                    </div>{" "}
                    {/* /container */}
                </main>
                <footer className="container">
                    <p>© Company 2017-2018</p>
                </footer>
            </>

        </div>
    )
}

export default HomePage;