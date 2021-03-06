import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Pagination from "material-ui-flat-pagination";
import Header from '../../components/Header';
import Searchbar from '../../components/Searchbar';
import ArticleCard from '../../components/ArticleCard';
import './styles.css';

class Home extends Component {
    state = {
        query: null,
        page: 1,
        pageSize: 21,
        totalResults: 0,
        results: [],
        loading: false,
    }

    componentWillMount() {
        const url = "https://newsapi.org/v2/top-headlines?apiKey=21be749136074d0f86d8584ad081fe19&category=technology&pageSize=3&country=ma";
        this.setState({ loading: true });
        fetch(url).then((response) => {
            response.json().then((value) => {
                this.setState({
                    results: value.articles || [],
                    totalResults: value.totalResults || 0,
                    loading: false
                });
            });
        });
    }

    componentDidMount() {
        console.log(this.props);
    }

    onQueryChange = (event) => {
        this.setState({ query: event.target.value });
    }

    newSearch = () => {
        this.setState({ page: 1 }, this.onSearch);
    }

    onSearch = () => {
        const url = "https://newsapi.org/v2/everything?q=" + this.state.query + "&sortBy=publishedAt&apiKey=21be749136074d0f86d8584ad081fe19&pageSize=" + this.state.pageSize + "&page=" + this.state.page;
        this.setState({ loading: true });
        fetch(url).then((response) => {
            response.json().then((value) => {
                this.setState({
                    results: value.articles || [],
                    totalResults: value.totalResults || 0,
                    loading: false
                });
            });
        });
    }

    onNextPage = (_, offset) => {
        window.scrollTo(0, 0);
        const page = (offset / this.state.pageSize) + 1;
        this.setState({ page: page }, this.onSearch);
    }

    onPress = (event) => {
        if (event.key === 'Enter') this.newSearch();
    }

    navigateTo = (route) => {
        // this.props.history.push(route);
    }

    render() {
        return (
            <div className="home">
                <Header label="Home" loading={this.state.loading} onSettingsPress={() => this.navigateTo('/settings')} />
                <Searchbar onChange={this.onQueryChange} onPress={this.onPress} onSearch={this.newSearch} />
                <Grid container justify="center">
                    {this.state.results.map((item, index) => (
                        <ArticleCard
                            title={item.title}
                            image={item.urlToImage}
                            summary={item.description}
                            text={item.content}
                            date={item.publishedAt}
                            url={item.url}
                            key={'article' + index}
                        />
                    ))}
                </Grid>
                {this.state.query && (
                    <Pagination
                        className="pagination"
                        limit={this.state.pageSize}
                        offset={(this.state.page - 1) * this.state.pageSize}
                        total={this.state.totalResults}
                        onClick={this.onNextPage}
                        size="large"
                    />
                )}
            </div>
        );
    }
}

export default Home;
