export default {
    template: `
        <div class="d-flex justify-content-center" style="margin-top: 10vh">
            <div class="p-5 text-center bg-light" style="border-radius: 10px;">
                <h1 class="text-center">Distribution of Books Based on Section</h1>
                <div v-if="loadingBooks" class="text-center">Loading...</div>
                <div v-else>
                    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
                        <canvas id="bookDistributionChart"></canvas>
                    </div>
                </div>
                <h1 class="text-center">Requests Status Pie Chart</h1>
                <div v-if="loadingRequests" class="text-center">Loading...</div>
                <div v-else>
                    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
                        <canvas id="requestsStatusChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            books: [],
            sections: [],
            requests: [],
            loadingBooks: true,
            loadingRequests: true
        };
    },
    async created() {
        await this.fetchBooks();
        await this.fetchRequests();
        this.createBookChart();
        this.createRequestsChart();
    },
    methods: {
        async fetchBooks() {
            this.loadingBooks = true;
            try {
                const response = await fetch('/all-books', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    this.books = data.books;
                    this.sections = [...new Set(this.books.map(book => book.section))];
                } else {
                    console.error('Failed to fetch books:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                this.loadingBooks = false;
            }
        },
        async fetchRequests() {
            this.loadingRequests = true;
            try {
                const response = await fetch('/all-request', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    this.requests = data;
                } else {
                    console.error('Failed to fetch requests:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                this.loadingRequests = false;
            }
        },
        createBookChart() {
            const sectionCounts = this.sections.map(section => {
                return this.books.filter(book => book.section === section).length;
            });

            const ctx = document.getElementById('bookDistributionChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.sections,
                    datasets: [{
                        label: 'Number of Books',
                        data: sectionCounts,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
        createRequestsChart() {
            const approvedCount = this.requests.filter(request => request.is_approved).length;
            const notApprovedCount = this.requests.length - approvedCount;

            const ctx = document.getElementById('requestsStatusChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Approved', 'Not Approved'],
                    datasets: [{
                        data: [approvedCount, notApprovedCount],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    }
};
